const {
    adjustUserDataBeforeSave, createUser, ChangeErrToHttpErrorIfIsUserDuplicated, getUser,
    updateOneUser
} = require("../loginOrSign");

// Erros
const HTTPErrors = require("../HTTPErrors");

// Modelos
const {Supplier, Client} = require("../../models/models");

const search = Object.freeze({
    key: "_id",
    value: 1
})

const itemToBeFound = Object.freeze({
    supplier: "cnpj_cpf",
    client: "email"
});

const req = {};

const model = Object.freeze({
    supplier: Supplier,
    client: Client
})

function createReq() {
    req.body = {
        name: "teste",
        address: "teste",
        password: "teste",
        email: "teste@teste.com",
        identityDocument: "12.345.678./9101-11",
    }
}

function mockModelFunctions(userType) {
    jest.spyOn(model[userType], "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(req.body)
    });
    jest.spyOn(model[userType], "findOneAndUpdate").mockResolvedValue(req.body);
}

async function expectUserDataToBePrepared(userType) {
    const userData = getUserData(userType);
    req.body.type = userType;

    const response = await adjustUserDataBeforeSave(req);
    expect(response).toEqual(userData);
}

function getUserData(userType) {
    return {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: "123456",
        [userType === "supplier" ? "cnpj_cpf" : "cpf"]: req.body.identityDocument
    };
}

async function expectUserModelToBeCreated(userType) {
    req.body.type = userType;

    const responseUserData = await adjustUserDataBeforeSave(req);
    const user = createUser(req.body.type, responseUserData);
    expect(user.constructor).toEqual(model[userType]);
}

function expectOriginalErrorToBeReturned(err) {
    const returnedError = ChangeErrToHttpErrorIfIsUserDuplicated(err);
    expect(returnedError).toEqual(err);
}

async function expectUserToBeFound(userType) {
    const user = await getUser(req.body.identityDocument, userType, {search: itemToBeFound[userType]});
    expect(model[userType].findOne).toHaveBeenCalledWith({ [itemToBeFound[userType]]: "12.345.678./9101-11" });
    expect(user).toEqual(req.body);
}

async function expectNotFoundErrorWhenUserNotFound(userType) {
    model[userType].findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null)
    });

    await expect(getUser(req.body.identityDocument, userType, {search: itemToBeFound[userType]})).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
    expect(model[userType].findOne).toHaveBeenCalledWith({ [itemToBeFound[userType]]: "12.345.678./9101-11" });
}

async function expectUpdatedUser(userType) {
    const updatedUser = await updateOneUser(req.body, userType, search);
    expect(updatedUser).toEqual(req.body);
    expect(model[userType].findOneAndUpdate).toHaveBeenCalledWith({[search.key]: search.value}, {$set: req.body});
}

async function expectNotFoundErrorWhenUserNotFoundInUpdate(userType) {
    model[userType].findOneAndUpdate.mockResolvedValue(null);
    await expect(updateOneUser(req.body, userType, search)).rejects.toThrow(new HTTPErrors("Usuario não encontrado", 404));
    expect(model[userType].findOneAndUpdate).toHaveBeenCalledWith({[search.key]: search.value}, {$set: req.body});
}

module.exports = {
    createReq, mockModelFunctions, 
    expectUserDataToBePrepared, expectUserModelToBeCreated, 
    expectOriginalErrorToBeReturned, expectUserToBeFound, 
    expectNotFoundErrorWhenUserNotFound, expectUpdatedUser, 
    expectNotFoundErrorWhenUserNotFoundInUpdate
};