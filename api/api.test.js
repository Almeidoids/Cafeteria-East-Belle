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

    beforeEach(() => {
        getTkn.mockReturnValue(tkn);
        connect.mockImplementation((editPassword, res, next) => next());

        jest.spyOn(Supplier, "findOne").mockReturnValue({
            exec: jest.fn(() => Supplier(modelDataTest))
        });
        jest.spyOn(Supplier.prototype, "save").mockResolvedValue({});
        jest.spyOn(Client, "findOne").mockReturnValue({
            exec: jest.fn(() => Client(modelDataTest))
        });
        jest.spyOn(Client.prototype, "save").mockResolvedValue({});
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

        setTkn.mockImplementation((editPassword, res) => {
            res.json({ [`${data.type}`]: data.name })
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
        Supplier.findOne = jest.fn(() => ({
            exec: jest.fn(() => null)
        }))

        const res = await request(app).get("/account/supplier/123").expect(404);
        expect(res.body).toEqual({ err: "Fornecedor não encontrado" });
    })

    test("Cadastrar usuário. /supplier/cadastro", async function () {
        const res1 = await request(app).post("/account/cadastro")
            .send(supplierData).expect(200);
        const res2 = await request(app).post("/account/cadastro")
            .send(clientData).expect(200);

        expect(res1.body).toEqual({ [data.type]: data.name });
        expect(res2.body).toEqual({ [data.type]: data.name });
    })

    test("Lançar erro caso usuário já exista", async function () {
        const throwError = () => {
            const err = new Error();
            err.code = 11000;
            throw err;
        }

        Supplier.prototype.save = jest.fn(() => throwError());
        Client.prototype.save = jest.fn(() => throwError());

        const res1 = await request(app).post("/account/cadastro")
            .send(supplierData).expect(400);
        const res2 = await request(app).post("/account/cadastro")
            .send(clientData).expect(400);

        expect(res1.body).toEqual({ err: "Este usuário já existe" });
        expect(res2.body).toEqual({ err: "Este usuário já existe" });
    });

    test("Fazer login. /supplier/login", async function () {
        const res1 = await request(app).post("/account/login")
            .send(supplierData).expect(200);
        const res2 = await request(app).post("/account/login")
            .send(clientData).expect(200);

        expect(res1.body).toEqual({ [data.type]: data.name });
        expect(res2.body).toEqual({ [data.type]: data.name });
    });

    test("Lançar erro caso senha de login esteja incorreta", async function () {
        bcrypt.compare = jest.fn(() => false);

        const res1 = await request(app).post("/account/login")
            .send(supplierData).expect(401);
        const res2 = await request(app).post("/account/login")
            .send(clientData).expect(401);

        expect(res1.body).toEqual({ err: "Senha incorreta" });
        expect(res2.body).toEqual({ err: "Senha incorreta" });
    });

    test("Pegar dados do usuário para auto-preenchimento em campos de formulário para edição. GET account/:type/:username/edit", async function () {
        const editData = {
            id: "123456789123456789012345",
            name: data.name,
            email: data.email,
            address: data.address,
        };

        const res1 = await request(app).get("/account/supplier/teste/edit").expect(200);
        const res2 = await request(app).get("/account/client/teste/edit").expect(200);
        expect(res1.body).toEqual({
            data: editData
        });
        expect(res2.body).toEqual({
            data: editData
        });
    });

    test("Tratar erro ao pegar dados do usuário", async function () {
        getUser.mockImplementation(() => {
            throw new Error();
        });

        const res1 = await request(app).get("/account/supplier/teste/edit").expect(500);
        const res2 = await request(app).get("/account/client/teste/edit").expect(500);
        expect(res1.body).toEqual({ err: "Erro interno no servidor" });
        expect(res2.body).toEqual({ err: "Erro interno no servidor" });
    })

    test("Editar usuario. POST account/:type/:username/edit", async function () {
        const res1 = await request(app).post("/account/supplier/teste/edit")
            .send(supplierData).expect(200);
        const res2 = await request(app).post("/account/client/teste/edit")
            .send(clientData).expect(200);

        expect(res1.body).toEqual({ [data.type]: data.name });
        expect(res2.body).toEqual({ [data.type]: data.name });
    })

    test("Tratar erro ao atualizar dados", async function () {
        updateOneUser.mockImplementation(() => {
            throw new Error();
        })

        const res1 = await request(app).post("/account/supplier/teste/edit")
            .send(data).expect(500);
        const res2 = await request(app).post("/account/client/teste/edit")
            .send(data).expect(500);
        expect(res1.body).toEqual({ err: "Erro interno no servidor" });
        expect(res2.body).toEqual({ err: "Erro interno no servidor" });
    })

    test("Editar senha de fornecedor. /:type/:username/edit/senha", async function () {
        const res = await request(app).post("/account/supplier/teste/edit/senha")
            .send(editPassword).expect(200);

        expect(res.text).toBe("Sucesso");
    })

    test("Editar senha de cliente", async function () {
        const res = await request(app).post("/account/client/teste/edit/senha")
            .send(editPassword).expect(200);

        expect(res.text).toBe("Sucesso");
    })

    test("Editar senha de cliente", async function () {
        const res = await request(app).post("/account/client/teste/edit/senha")
            .send(editPassword).expect(200);

        expect(res.text).toBe("Sucesso");
    })

    test("Lançar erro caso usuário não seja encontrado", async function () {
        Supplier.findOne = jest.fn(() => ({
            exec: jest.fn(() => null)
        }));
        const res = await request(app).post("/account/supplier/teste/edit/senha")
            .send(editPassword).expect(404);

        expect(res.body).toEqual({ err: "Usuario não encontrado" });
    });

    test("Lançar erro caso senha esteja incorreta", async function () {
        bcrypt.compare = jest.fn(() => false);
        const res = await request(app).post("/account/supplier/teste/edit/senha")
            .send(editPassword).expect(401);

        expect(res.body).toEqual({ err: "Senha incorreta" });
    });

    test("Limpar cookies de autenticação. /account/exit", async function () {
        const res = await request(app).get("/account/exit");
        expect(res.text).toBe("Limpeza concluida");
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

});