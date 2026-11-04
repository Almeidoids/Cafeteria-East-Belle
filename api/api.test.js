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
import path from "path";
import fs from "fs/promises";

// API
import app from "../server-test";

// Utilitários
import { getTkn, setTkn } from "./util/authentication";
import connect from "./util/connect";
import { updateOneUser, getUser } from "./util/loginOrSign";

// Erros
import HTTPErrors from "./util/HTTPErrors";

// Modelos
import { Client, Supplier, Products } from "./models/models";

// Testes
import { mockQueryResult, mockBasicModelOperations, postUserReq } from "./test/api.testHelper";

const data = {
    name: "teste",
    email: "teste@teste.com",
    identityDocument: "12.345.678./9101-11",
    address: "teste",
    password: "teste",
    active: true,
}
const id = 123456789123456789012345n;
const modelDataTest = { _id: new mongoose.Types.ObjectId(id.toString()), ...data };
const err = new Error();

beforeEach(() => {
    connect.mockImplementation((req, res, next) => next());

    mockBasicModelOperations(Supplier, modelDataTest);
})

describe("Testes de account.js", function () {
    const tkn = { name: "teste", type: "client" };
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

        mockBasicModelOperations(Client, modelDataTest);
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
        mockQueryResult(Supplier, "findOne", null);
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
        mockQueryResult(model, "findOne", null);
        await postUserReq({
            url: `/account/${type}/teste/edit/senha`,
            status: 404,
            expectedResponse: { err: "Usuario não encontrado" }
        }, editPassword);
        expect(model.findOne).toHaveBeenCalledWith({ name: "teste" });
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
            console.log(cookies);
            cookie.push(value.split(";"));
        })

        expect(res.text).toBe("Limpeza concluida");

        cookie.forEach(function (value) {
            const keyAndValue = value[0].split("=");
            if (keyAndValue[0] === "acessToken" || keyAndValue[0] === "refreshToken") {
                expect(keyAndValue[1]).toBe("");
            }
        })
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

});

describe("Testes de comercial.js", function () {
    const image = path.resolve("public", "banner", "banner.jpg");
    const productsData = [{
        _id: new mongoose.Types.ObjectId(id.toString()),
        name: "teste",
        description: "teste",
        price: "12.34",
        quantity: 50,
        offer: 10,
        buyed: 10,
        supplier: modelDataTest,
        images: image,
        expireAt: new Date("2026-11-01"),
    },
    {
        _id: new mongoose.Types.ObjectId((id + 1n).toString()),
        name: "teste2",
        description: "teste2",
        price: "12.34",
        quantity: 50,
        offer: 10,
        buyed: 10,
        supplier: modelDataTest,
        images: image,
        expireAt: new Date("2026-11-01"),
    }]
    const reqFormData = {
        name: productsData[0].name,
        description: productsData[0].description,
        price: productsData[0].price,
        quantity: productsData[0].quantity,
        offer: productsData[0].offer,
        supplierName: modelDataTest.name
    };
    const editReqFormData = {...reqFormData, buyed: productsData[0].buyed};

    beforeEach(() => {
        mockQueryResult(Products, "find", productsData);
        mockBasicModelOperations(Products, productsData[0]);
    })

    test("Pegar informações do fornecedor. /comercial/fornecedor/get/:fornecedor", async function () {
        const resultData = {
            name: modelDataTest.name,
            active: modelDataTest.active,
            products: productsData.map((item, index) => {
                return {
                    id: (id + BigInt(index)).toString(),
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    buyed: item.buyed,
                    offer: item.offer,
                }
            })
        }

        const res = await request(app).get("/comercial/fornecedor/get/teste").expect(200);
        expect(res.body).toEqual({ data: resultData });
    });

    test("Lançar erro caso fornecedor não encontrado", async function () {
        mockQueryResult(Supplier, "findOne", null);

        const res = await request(app).get("/comercial/fornecedor/get/teste").expect(404);
        expect(res.body).toEqual({ err: "Usuário não encontrado" });
    })

    test("Salvar Produto. POST /comercial/fornecedor/produto", async function () {
        const res = await request(app).post("/comercial/fornecedor/produto")
            .attach("image", image)
            .field("items", JSON.stringify(reqFormData))
            .expect(200);

        expect(Products.prototype.save).toHaveBeenCalled();
        expect(res.text).toBe("Produto Salvo.");
    });

    test("Lançar erro caso usuário não esteja ativo.", async function () {
        mockQueryResult(Supplier, "findOne", { ...modelDataTest, active: false });

        const res = await request(app).post("/comercial/fornecedor/produto")
            .attach("image", image)
            .field("items", JSON.stringify(reqFormData))
            .expect(403);

        expect(res.body).toEqual({ err: "É necessário <a href = '/verificarConta'>verificar</a> sua conta para criar produtos" });
    });

    test("Excluir todos os produtos do fornecedor. DELETE /comercial/fornecedor/produto", async function () {
        jest.spyOn(Products, "deleteMany").mockResolvedValue({});
        const res = await request(app).delete("/comercial/fornecedor/produto/?supplier=teste").expect(200);

        expect(Products.deleteMany).toHaveBeenCalledWith({ supplier: productsData[0].supplier._id });
        expect(res.text).toBe("Sucesso");
    })

    test("Capturar erro ao excluir todos os produtos", async function () {
        jest.spyOn(Products, "deleteMany").mockRejectedValue(err);

        const res = await request(app).delete("/comercial/fornecedor/produto/?supplier=teste").expect(500);
        expect(res.body).toEqual({ err: "Erro interno no servidor" });
    })

    test("Pegar dados do produto para auto-completar formulário de edição. GET /comercial/fornecedor/produto/edit/:id", async function () {
        mockQueryResult(Products, "findById", productsData[0]);
        const result = {
            id: id.toString(),
            name: productsData[0].name,
            description: productsData[0].description,
            price: productsData[0].price,
            quantity: productsData[0].quantity,
            offer: productsData[0].offer,
            images: productsData[0].images
        };

        const res = await request(app).get(`/comercial/fornecedor/produto/edit/${id.toString()}`).expect(200);
        expect(res.body).toEqual({ data: result });
    })

    test("Lançar erro ao não encontrar produto para autocompletar formulário de edição", async function () {
        mockQueryResult(Products, "findById", null);

        const res = await request(app).get(`/comercial/fornecedor/produto/edit/${id.toString()}`).expect(404);
        expect(res.body).toEqual({ err: "Produto não encontrado." });
    });

    test("Editar produtos. POST /comercial/fornecedor/produto/edit/:id", async function () {
        jest.spyOn(Products, "findByIdAndUpdate").mockResolvedValue({});

        const res = await request(app).post(`/comercial/fornecedor/produto/edit/${id.toString()}`)
            .attach("image", image)
            .field("items", JSON.stringify(editReqFormData)).expect(200);

        const resultData = { ...editReqFormData, images: [await fs.readFile(image)] };

        expect(Products.findByIdAndUpdate).toHaveBeenCalledWith(id.toString(), { $set: resultData });
        expect(res.text).toBe("Sucesso")
    });

    test("Capturar erro ao editar.", async function () {
        jest.spyOn(Products, "findByIdAndUpdate").mockRejectedValue(err);

        const res = await request(app).post(`/comercial/fornecedor/produto/edit/${id.toString()}`)
            .attach("image", image)
            .field("items", JSON.stringify(editReqFormData)).expect(500);

        expect(res.body).toEqual({ err: "Erro interno no servidor" })
    });

    test("Editar diversos produtos. /comercial/fornecedor/produto/editAll", async function () {
        jest.spyOn(Products, "bulkWrite").mockResolvedValue({});
        const res = await request(app).post("/comercial/fornecedor/produto/editAll").send(productsData).expect(200);

        expect(Products.bulkWrite).toHaveBeenCalled();
        expect(res.text).toBe("Sucesso");
    })

    test("Capturar erro ao editar diversos produtos", async function () {
        jest.spyOn(Products, "bulkWrite").mockRejectedValue(err);

        const res = await request(app).post("/comercial/fornecedor/produto/editAll").send(productsData).expect(500);
        expect(res.body).toEqual({ err: "Erro interno no servidor" });
    })

    test("Deletar produto. /comercial/fornecedor/produto/delete/:id", async function () {
        jest.spyOn(Products, "findByIdAndDelete").mockResolvedValue({});
        const res = await request(app).delete(`/comercial/fornecedor/produto/delete/${id.toString()}`).expect(200);

        expect(Products.findByIdAndDelete).toHaveBeenCalledWith(id.toString());
        expect(res.text).toBe("sucesso");
    })

    test("Capturar erro ao deletar produto", async function () {
        jest.spyOn(Products, "findByIdAndDelete").mockRejectedValue(err);

        const res = await request(app).delete(`/comercial/fornecedor/produto/delete/${id.toString()}`).expect(500);
        expect(res.body).toEqual({ err: "Erro interno no servidor" });
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
})

afterEach(() => {
    jest.restoreAllMocks();
})