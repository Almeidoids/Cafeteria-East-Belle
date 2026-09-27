const request = require("supertest");
const app = require("./account");
const { getTkn } = require("./util/authentication");

describe("Testes de account.js", function() {
    const tkn = {name: "teste", type: "client"};
    
    beforeEach(() => {
        getTkn = jest.fn(() => tkn );
    })
    
    test("Teste da requisição de validação de conta. /account/", async () => {
        const res = await request(app).get("/account").expect(200);
        expect(res.body).toEqual(tkn);
    })

});