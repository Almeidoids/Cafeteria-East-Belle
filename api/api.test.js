// Mocks
jest.mock("./util/authentication", () => ({
    getTkn: jest.fn(),
    setTkn: jest.fn(),
}));
jest.mock("./util/connect");
jest.mock("./util/loginOrSign", function () {
    const originalModules = jest.requireActual("./util/loginOrSign");

    return {
        ...originalModules,
        updateOneUser: jest.fn(),
        getUser: jest.fn()
    }
})

import request from "supertest";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

// API
import app from "../server-test";

// Utilitários
import { getTkn, setTkn } from "./util/authentication";
import connect from "./util/connect";
import { updateOneUser, getUser } from "./util/loginOrSign";

// Erros
import HTTPErrors from "./util/HTTPErrors";

// Modelos
import { Client, Supplier } from "./models/models";

// Testes
import { mockUserModel, postUserReq } from "./test/accountTestFunctions";

describe("Testes de account.js", function () {
    const tkn = { name: "teste", type: "client" };
    const data = {
        name: "teste",
        email: "teste@teste.com",
        identityDocument: "12.345.678./9101-11",
        address: "teste",
        password: "teste",
    }
    const supplierData = { ...data, type: "supplier" }
    const clientData = { ...data, type: "client" }
    const modelDataTest = { _id: new mongoose.Types.ObjectId("123456789123456789012345"), ...data };
    const editPassword = {
        oldPassword: "Teste",
        newPassword: "123456"
    }
    const userType = [
        ["supplier", Supplier, { ...data, type: "supplier" }], 
        ["client", Client, { ...data, type: "client" }]
    ];

    beforeEach(() => {
        getTkn.mockReturnValue(tkn);
        connect.mockImplementation((req, res, next) => next());

        mockUserModel("supplier", modelDataTest);
        mockUserModel("client", modelDataTest);

        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        setTkn.mockImplementation((req, res) => {
            res.json({ [`${req.type}`]: req.body.name })
        })
        getUser.mockResolvedValue(modelDataTest);
    })

    test("requisição para validar login. /account/", async function () {
        const res = await request(app).get("/account").expect(200);
        expect(res.body).toEqual({ user: tkn });
    });

    test("retornar erro na requisição de validação de login. /account/", async function () {
        getTkn.mockImplementation(() => {
            throw new HTTPErrors("Acesso NÃO autorizado", 403)
        });

        const res = await request(app).get("/account").expect(403);
        expect(res.body.err).toBe("Acesso NÃO autorizado");
    })

    test("Requisição para retornar id de fornecedor. /supplier/:supplier", async function () {
        const res = await request(app).get("/account/supplier/123").expect(200);

        expect(Supplier.findOne).toHaveBeenCalled();
        expect(res.body).toEqual({ id: "123456789123456789012345" });
    })

    test("retornar erro na requisição para retornar id de fornecedor.", async function () {
        jest.spyOn(Supplier, "findOne").mockReturnValue({
            exec: jest.fn(() => null)
        });

        const res = await request(app).get("/account/supplier/123").expect(404);
        expect(res.body).toEqual({ err: "Fornecedor não encontrado" });
    })

    test.each(userType)("Cadastrar usuário %s. /account/cadastro", async function (type, model, userData) {
        await postUserReq({
            url: "/account/cadastro",
            status: 200,
            expectedResponse: { [userData.type]: userData.name }
        }, userData);
    })

    test.each(userType)("Lançar erro caso %s já exista", async function (type, model, userData) {
        const err = new Error();
        err.code = 11000;

        jest.spyOn(model.prototype, "save").mockRejectedValue(err);

        await postUserReq({
            url: "/account/cadastro",
            status: 400,
            expectedResponse: { err: "Este usuário já existe" }
        }, userData);
    });

    test.each(userType)("Fazer login. /supplier/login", async function (type, model, userData) {
        await postUserReq({
            url: "/account/login",
            status: 200,
            expectedResponse: { [userData.type]: userData.name }
        }, userData);
    });

    test.each(userType)("Lançar erro caso senha de login esteja incorreta", async function (type, model, userData) {
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

        await postUserReq({
            url: "/account/login",
            status: 401,
            expectedResponse: { err: "Senha incorreta" }
        }, userData);
    });

    test.each(userType)("Pegar dados do usuário para auto-preenchimento em campos de formulário para edição. GET account/:type/:username/edit", async function (type, model, userData) {
        const editData = {
            id: "123456789123456789012345",
            name: userData.name,
            email: userData.email,
            address: userData.address,
        };

        const res1 = await request(app).get(`/account/${type}/teste/edit`).expect(200);
        expect(res1.body).toEqual({ data: editData });
    });

    test.each(userType)("Tratar erro ao pegar dados do usuário", async function (type, model, userData) {
        getUser.mockImplementation(() => {
            throw new Error();
        });

        const res1 = await request(app).get(`/account/${type}/teste/edit`).expect(500);
        expect(res1.body).toEqual({ err: "Erro interno no servidor" });
    })

    test.each(userType)("Editar usuario. POST account/:type/:username/edit", async function (type, model, userData) {
        await postUserReq({
            url: `/account/${type}/teste/edit`,
            status: 200,
            expectedResponse: { [userData.type]: userData.name }
        }, userData);
    })

    test.each(userType)("Tratar erro ao atualizar dados", async function (type, model, userData) {
        updateOneUser.mockImplementation(() => {
            throw new Error();
        })

        await postUserReq({
            url: `/account/${type}/teste/edit`,
            status: 500,
            expectedResponse: { err: "Erro interno no servidor" }
        }, userData);
    })

    test.each(userType)("Editar senha de %s. /:type/:username/edit/senha", async function (type, model) {
        await postUserReq({
            url: `/account/${type}/teste/edit/senha`,
            status: 200,
            expectedResponse: "Sucesso"
        }, editPassword, "text");
        expect(model.prototype.save).toHaveBeenCalled();
    })

    test.each(userType)("Lançar erro caso %s não seja encontrado", async function (type, model) {
        jest.spyOn(model, "findOne").mockReturnValue({
            exec: jest.fn(() => null)
        });
        await postUserReq({
            url: `/account/${type}/teste/edit/senha`,
            status: 404,
            expectedResponse: { err: "Usuario não encontrado" }
        }, editPassword);
        expect(model.findOne).toHaveBeenCalledWith({name: "teste"});
    });

    test.each(userType)("Lançar erro caso senha do %s esteja incorreta", async function (type, model, userData) {
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
        await postUserReq({
            url: `/account/${type}/teste/edit/senha`,
            status: 401,
            expectedResponse: { err: "Senha incorreta" }
        }, editPassword);
        expect(bcrypt.compare).toHaveBeenCalledWith(editPassword.oldPassword, userData.password);
    });

    test("Limpar cookies de autenticação. /account/exit", async function () {
        const res = await request(app).get("/account/exit");
        const cookies = res.headers["set-cookie"];
        const cookie = [];
        
        cookies.forEach(function (value) {
            cookie.push(value.split(";")[0].split("=")[1]);
        })

        expect(res.text).toBe("Limpeza concluida");

        cookie.forEach(function (value) {
            console.log(value);
            expect(value).toBe("");
        })
    })

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    })

});