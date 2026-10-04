const jwt = require("jsonwebtoken");
const { setTkn, getTkn } = require("./authentication");
const HTTPErrors = require("./HTTPErrors");
const { testResultOfSignJWT, mockJWTVerify, testGetTkn, testGetTknErrorThrown, expectCookiesHasRecorded, prepareRefreshTknTest } = require("./test/authenticationTestFunctions");
let mongoose = null;

describe("Testando funções de authentication.js", function () {
    const tknTest = "token gerado por jwt";
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    };
    let res;
    let req;
    const tkns = {access: "testeAcesso", refresh: "testeRefresh"};

    beforeEach(() => {
        res = {
            cookie: jest.fn(),
            json: jest.fn(),
        };

        req = {
            body: {
                name: "teste"
            },
            type: "client",
            headers: {
                cookie: `acessToken=${tkns.access};refreshToken=${tkns.refresh}`
            }
        };

        jest.spyOn(jwt, "sign").mockReturnValue(tknTest);
    })

    test("Criar ou alterar um token para usuário. Função setTkn", function () {
        setTkn(req, res);
        testResultOfSignJWT(req);
        expect(res.json).toHaveBeenCalledWith({ [req.type]: req.body.name });
    });

    test("Guardar tokens em cookies. Função setTkn", function() {
        setTkn(req, res);
        expectCookiesHasRecorded(res, tknTest, cookieOptions);
    })

    test("Capturar tokens caso sucesso. Função getTkn", function () {
        jwt.verify = mockJWTVerify()
        testGetTkn(req, res, tkns.access);
    });

    test("Mandar mensagem de erro caso haja falha na verificação do token de acesso. Função getTkn", function () {
        jwt.verify = mockJWTVerify(true);
        testGetTknErrorThrown(req, res, "Acesso NÃO autorizado");
    });

    test("Recarregar token caso acessToken não exista", function () {
        prepareRefreshTknTest(tkns, req);
        testGetTkn(req, res, tkns.refresh);
        testResultOfSignJWT(req);

        expect(jwt.verify).toHaveBeenCalledTimes(2);
    });

    test("Mandar mensagem de erro caso recarregar o token falhe.", function () {
        prepareRefreshTknTest(tkns, req, true);
        testGetTknErrorThrown(req, res, "Sua sessão expirou");
    })

    test("Mandar erro caso haja falha ao tratar os cookies.", function () {
        req.headers.cookie = null;
        expect(() => getTkn(req, res)).toThrow(new HTTPErrors("Faça login em sua conta primeiro", 401));
    });

    test("Guardar tokens em cookies. Função getTkn", function() {
        prepareRefreshTknTest(tkns, req);
        getTkn(req, res);
        expectCookiesHasRecorded(res, tknTest, cookieOptions);
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
});

describe("Testando funções de connect.js", function() {
    let res = null;
    let connect = null;
    
    beforeEach(() => {
        jest.resetModules();

        res = {
            status: jest.fn(() => res ),
            json: jest.fn()
        };

        mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockResolvedValue(true);
        connect = require("./connect");
    })


    test("Testando conexão do mongoose com o banco", async function() {
        const next = jest.fn();
        await connect(null, res, next);

        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
    })

    test("Não executar connect caso a conexão já esteja aberta.", async function() {
        const next = jest.fn();
        await connect(null, res, next);
        await connect(null, res, next);

        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(2);
    })

    test("Caso haja erro na conexão com o banco.", async function() {
        mongoose.connect = jest.fn(() => {
            throw new Error();
        });

        const next = jest.fn();
        await connect(null, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(Error());
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
})