jest.mock("./util/authentication", () => ({
    getTkn: jest.fn(),
    setTkn: jest.fn(),
}));

import request from "supertest";
import app from "../server-test";
import { getTkn } from "./util/authentication";
import HTTPErrors from "./util/HTTPErrors";

describe("Testes de account.js", function() {
    const tkn = {name: "teste", type: "client"};
    
    beforeEach(() => {
        getTkn.mockReturnValue(tkn);
    })
    
    test("Teste da requisição de validação de conta. /account/", async function () {
        const res = await request(app).get("/account").expect(200);
        expect(res.body).toEqual({user: tkn});
    });

    test("Teste da captura de erro da requisição de validação de conta.", async function () {
        getTkn.mockImplementation(() => {
            throw new HTTPErrors("Acesso NÃO autorizado", 403)
        });

        const res = await request(app).get("/account").expect(403);
        expect(res.body.err).toBe("Acesso NÃO autorizado");
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })

});