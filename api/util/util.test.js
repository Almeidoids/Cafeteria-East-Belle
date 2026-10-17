const jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Funções testadas
const { setTkn, getTkn } = require("./authentication");
const { adjustUserDataBeforeSave, createUser, ChangeErrToHttpErrorIfIsUserDuplicated, getUser, updateOneUser } = require("./loginOrSign");

// Funções utilitárias
const { testResultOfSignJWT, mockJWTVerify, testGetTkn, testGetTknErrorThrown, expectCookiesHasRecorded, prepareRefreshTknTest } = require("./test/authenticationTestFunctions");

// Erros customizados
const HTTPErrors = require("./HTTPErrors");

// Modelos
const { Supplier, Client } = require("../models/models");

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
    const body = {
        name: "teste",
        address: "teste",
        password: "teste",
        email: "teste@teste.com",
        identityDocument: "12.345.678./9101-11",
        type: "supplier"
    };
    let req = null;
    const search = {
        key: "_id",
        value: 1
    }

    beforeEach(() => {
        req = { body: { ...body } };

        jest.spyOn(bcrypt, "hash").mockReturnValue("123456");

        jest.spyOn(Supplier, "findOne").mockReturnValue({
            exec: jest.fn(() => req.body)
        });
        jest.spyOn(Client, "findOne").mockReturnValue({
            exec: jest.fn(() => req.body)
        });

        jest.spyOn(Supplier, "findOneAndUpdate").mockReturnValue(req.body);
        jest.spyOn(Client, "findOneAndUpdate").mockReturnValue(req.body);
    })

    test("Pegar corpo da requisição como fornecedor", async function () {
        const responseData = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: "123456",
            cnpj_cpf: req.body.identityDocument
        };

        const userData = await adjustUserDataBeforeSave(req);
        expect(userData).toEqual(responseData);
    });

    test("Pegar corpo da requisição como cliente", async function() {
        const responseData = {
            name: req.body.name,
            email: req.body.email,
            address: req.body.address,
            password: "123456",
            cpf: req.body.identityDocument
        };
        req.body.type = "client";

        const userData = await adjustUserDataBeforeSave(req);
        expect(userData).toEqual(responseData);
    })

    test("Criar modelo de usuário como fornecedor", async function () {
        let userData = await adjustUserDataBeforeSave(req);
        let user = createUser(req.body.type, userData);

        expect(user.constructor).toEqual(Supplier);
    });

    test("Criar modelo de usuario como cliente", async function() {
        req.body.type = "client";
        
        const userData = await adjustUserDataBeforeSave(req);
        const user = createUser(req.body.type, userData);
        expect(user.constructor).toEqual(Client);
    })

    test("Lançar erro 400 caso usuário já exista no cadastro de usuários", function() {
        const err = {code: 11000};
        const expectedError = new HTTPErrors("Este usuário já existe", 400);

        const notFindError = ChangeErrToHttpErrorIfIsUserDuplicated(err);
        expect(notFindError).toEqual(expectedError);
    })

    test("Retornar erro padrão caso a exceção não seja de usuário duplicado", function() {
        const err = new Error("Erro no servidor");
        const returnedError = ChangeErrToHttpErrorIfIsUserDuplicated(err);
        
        expect(returnedError).toEqual(err);
    })

    test("Procurar fornecedor", async function() {
        const identifier = req.body.cnpj_cpf;
        const user = await getUser(identifier, "supplier", req.body.cnpj_cpf);
        expect(user).toEqual(req.body);
    });

    test("Procurar cliente", async function() {
        const identifier = req.body.cnpj_cpf;
        const user = await getUser(identifier, "client", req.body.cnpj_cpf);
        expect(user).toEqual(req.body);
    })

    test("Lançar erro caso não encontre fornecedor ou cliente", function() {
        Supplier.findOne.mockReturnValue({
            exec: jest.fn(() => null)
        });
        Client.findOne.mockReturnValue({
            exec: jest.fn(() => null)
        });

        expect(async () => getUser(req.body.cnpj_cpf, "supplier", req.body.cnpj_cpf)).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
        expect(async () => getUser(req.body.cnpj_cpf, "client", req.body.cnpj_cpf)).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
    })

    test("Atualizar fornecedor", async function() {
        const updatedUser = await updateOneUser(req.body, "supplier", search);
        expect(updatedUser).toEqual(req.body);
    })

    test("Atualizar cliente", async function() {
        const updatedUser = await updateOneUser(req.body, "client", search);
        expect(updatedUser).toEqual(req.body);
    })

    test("Lançar erro caso não encontre fornecedor ou cliente para atualizar", async function() {
        Supplier.findOneAndUpdate.mockReturnValue(null);
        Client.findOneAndUpdate.mockReturnValue(null);
        expect(() => updateOneUser(req.body, "supplier", search)).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
        expect(() => updateOneUser(req.body, "client", search)).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })
})