const { Client, Supplier } = require("../models/models");
const bcrypt = require("bcrypt");
const HTTPErrors = require("./HTTPErrors");

const user = Object.freeze({
    client: {model: Client, search: "email"},
    supplier: {model: Supplier, search: "cnpj_cpf"}
});

async function adjustUserDataBeforeSave(req) {
    let { name, address, password, email, identityDocument } = req.body;        
    const cryPassword = await bcrypt.hash(password, 10);
    
    return {
        name: name, 
        email: email, 
        address: address,
        password: cryPassword, 
        cnpj_cpf: identityDocument 
    }
}

function createUser(type, data) {
    return new user[type].model(data);
}

function ChangeErrToHttpErrorIfIsUserDuplicated(err) {
    if (err.code === 11000) {
        return new HTTPErrors("Este usuário já existe", 400);
        // return { code: 400, message: "Este usuário já existe" }
    }

    return err;
}

async function getUser(identifier, type, { search } = user[type]) {
    const {model} = user[type];
    const returnUser = await model.findOne({[`${search}`]: identifier}).exec();
    throwErrorIfNotFinded(returnUser);
    
    return returnUser;
}

function throwErrorIfNotFinded(target) {
    if (!target) {
        throw new HTTPErrors("Usuario não encontrado", 404);
    }
}

async function updateOneUser(items, type, search) {
    const {model} = user[type];
    const returnUser = await model.findOneAndUpdate({ [`${search.key}`]: search.value }, { $set: items })
    throwErrorIfNotFinded(returnUser);

    return returnUser;
}

module.exports = { 
    adjustUserDataBeforeSave, 
    createUser, 
    ChangeErrToHttpErrorIfIsUserDuplicated, 
    getUser,
    updateOneUser
};