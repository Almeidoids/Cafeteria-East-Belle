const jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Funções testadas
const { setTkn, getTkn } = require("./authentication");
const { ChangeErrToHttpErrorIfIsUserDuplicated } = require("./loginOrSign");

// Funções utilitárias
const { 
    testResultOfSignJWT, mockJWTVerify, testGetTkn, testGetTknErrorThrown, 
    expectCookiesHasRecorded, prepareRefreshTknTest 
} = require("./test/authenticationTestFunctions");
const { 
    mockModelFunctions, expectUpdatedUser, expectUserDataToBePrepared, 
    expectUserModelToBeCreated, expectOriginalErrorToBeReturned, expectUserToBeFound, 
    expectNotFoundErrorWhenUserNotFound, expectNotFoundErrorWhenUserNotFoundInUpdate, createReq
} = require("./test/loginOrSignTestFunctions");

// Erros customizados
const HTTPErrors = require("./HTTPErrors");

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
    const tkns = { access: "testeAcesso", refresh: "testeRefresh" };

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

    test("Guardar tokens em cookies. Função setTkn", function () {
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

    test("Guardar tokens em cookies. Função getTkn", function () {
        prepareRefreshTknTest(tkns, req);
        getTkn(req, res);
        expectCookiesHasRecorded(res, tknTest, cookieOptions);
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
});

describe("Testando funções de connect.js", function () {
    const connectionError = new Error("Falha ao se conectar ao banco");
    let next = null;
    let expectConnectionBehavior = null;
    let attemptConnectionMultipleTimes = null;

    beforeEach(() => {
        jest.resetModules();

        mongoose = require("mongoose");
        jest.spyOn(mongoose, "connect").mockResolvedValue(true);
        next = jest.fn();

        ({ expectConnectionBehavior, attemptConnectionMultipleTimes } = require("./test/connectTestFunctions"));
    })


    test("conectar com o banco", async function () {
        await attemptConnectionMultipleTimes(1, next);
        expectConnectionBehavior(next, {
            connect: { toHaveBeenCalledTimes: 1 },
            next: { toHaveBeenCalledTimes: 1 },
        });
    })

    test("Não conectar novamente caso já conectado.", async function () {
        await attemptConnectionMultipleTimes(2, next);
        expectConnectionBehavior(next, {
            connect: { toHaveBeenCalledTimes: 1 },
            next: { toHaveBeenCalledTimes: 2 },
        });
    })

    test("Lançar erro caso haja erro na conexão com o banco.", async function () {
        mongoose.connect.mockRejectedValue(connectionError)

        await attemptConnectionMultipleTimes(1, next);
        expectConnectionBehavior(next, {
            connect: { toHaveBeenCalledTimes: 1 },
            next: { toHaveBeenCalledTimes: 1 },
        });

        expect(next).toHaveBeenCalledWith(connectionError);
    })

    test("Se chamado novamente, reconectar caso primeira tentativa dê erro.", async function () {
        mongoose.connect.mockRejectedValueOnce(connectionError)

        await attemptConnectionMultipleTimes(2, next)

        expectConnectionBehavior(next, {
            connect: { toHaveBeenCalledTimes: 2 },
            next: { toHaveBeenCalledTimes: 2 },
        });

        expect(next).toHaveBeenNthCalledWith(1, connectionError);
        expect(next).toHaveBeenNthCalledWith(2)
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
});

describe("Testando funções de loginOrSign.js", function () {
    beforeEach(() => {
        createReq();

        jest.spyOn(bcrypt, "hash").mockResolvedValue("123456");
        mockModelFunctions("supplier");
        mockModelFunctions("client");
    })

    test("Pegar corpo da requisição como fornecedor", async function () {
        await expectUserDataToBePrepared("supplier");
    });

    test("Pegar corpo da requisição como cliente", async function () {
        await expectUserDataToBePrepared("client");
    })

    test("Criar modelo de usuário como fornecedor", async function () {
        await expectUserModelToBeCreated("supplier");
    });

    test("Criar modelo de usuario como cliente", async function () {
        await expectUserModelToBeCreated("client");
    })

    test("Lançar erro 400 caso usuário já exista no cadastro de usuários", function () {
        const err = {code: 11000};
        const expectedError = new HTTPErrors("Este usuário já existe", 400);

        const notFindError = ChangeErrToHttpErrorIfIsUserDuplicated(err);
        expect(notFindError).toEqual(expectedError);
    })

    test("Retornar erro padrão caso a exceção não seja de usuário duplicado", function () {
        expectOriginalErrorToBeReturned(new Error("Erro no servidor"));
    })

    test("Procurar fornecedor", async function () {
        await expectUserToBeFound("supplier");
    });

    test("Procurar cliente", async function () {
        await expectUserToBeFound("client");
    })

    test("Lançar erro caso não encontre fornecedor ou cliente", async function () {
        await expectNotFoundErrorWhenUserNotFound("supplier");
        await expectNotFoundErrorWhenUserNotFound("client");
    })

    test("Atualizar fornecedor", async function () {
        await expectUpdatedUser("supplier");
    })

    test("Atualizar cliente", async function () {
        await expectUpdatedUser("client");
    })

    test("Lançar erro caso não encontre fornecedor ou cliente para atualizar", async function () {
        await expectNotFoundErrorWhenUserNotFoundInUpdate("supplier");
        await expectNotFoundErrorWhenUserNotFoundInUpdate("client");
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
})