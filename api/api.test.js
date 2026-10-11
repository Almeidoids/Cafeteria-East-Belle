jest.mock("./util/authentication", () => ({
    getTkn: jest.fn(),
    setTkn: jest.fn(),
}));
jest.mock("./util/connect");

import request from "supertest";
import app from "../server-test";
import { getTkn } from "./util/authentication";
import HTTPErrors from "./util/HTTPErrors";
import { Supplier } from "./models/models";
import connect from "./util/connect";

describe("Testes de account.js", function () {
    const tkn = { name: "teste", type: "client" };

    beforeEach(() => {
        getTkn.mockReturnValue(tkn);
        connect.mockImplementation((req, res, next) => next());

        jest.spyOn(Supplier, "findOne").mockReturnValue({
            exec: jest.fn(() => ({ _id: "123" }))
        });
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
        expect(res.body).toEqual({ id: "123" });
    })

    test("retornar erro na requisição para retornar id de fornecedor.", async function() {
        Supplier.findOne = jest.fn(() => ({
            exec: jest.fn(() => null)
        }))

        const res = await request(app).get("/account/supplier/123").expect(404);
        expect(res.body).toEqual({err: "Fornecedor não encontrado"});
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

});