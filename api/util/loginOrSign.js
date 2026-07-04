const { Client, Supplier } = require("../models/models");

async function signUp(req, res, next, type) {
    let { name, email, address, password, identityDocument } = getReqBody(req.type);
    req.type = type;

    const cryPassword = await bcrypt.hash(password, 10);
    const data = {
        name: name,
        email: email,
        address: address,
        password: cryPassword,
        [type === "client" ? "cpf" : "cnpj"]: identityDocument
    }

    const newUser = getUser(type, data);

    try {
        await newUser.save()
        next();
    }

    catch (err) {
        console.log(`Erro ao cadastrar usuario ${err}`)
        const {code, message} = identifyError(err);
        res.status(code).json(message);
    }
}

function getReqBody(req, type) {
    let { name, email, address, password } = req.body;
    let identityDocument = "";

    if (type === "client") {
        identityDocument = req.body.cpf;
    }
    if (type === "supplier") {
        identityDocument = req.body.cnpj;
    }

    return { name, email, address, password, identityDocument };
}

function getUser(type, data) {
    let user;
    if (type === "client") {
        user = new Client(data);
    }
    if (type === "supplier") {
        user = new Supplier(data);
    }

    return user
}

function identifyError(err) {
    if (err.code === 11000) {
        return {code: 400, message: "Este usuário já existe"}
    }

    else {
        return {code: 500, message: "Erro ao cadastrar usuário"}
    }
}

module.exports = {signUp};