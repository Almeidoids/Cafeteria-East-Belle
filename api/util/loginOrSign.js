const { Client, Supplier } = require("../models/models");
const bcrypt = require("bcrypt");

async function signUp(req, res, next, type) {
    let { name, address, password, email, identityDocument } = req.body;
    req.type = type;

    const cryPassword = await bcrypt.hash(password, 10);
    const data = {
        name: name,
        email: email,
        address: address,
        password: cryPassword,
        [type === "client" ? "cpf" : "cnpj"]: identityDocument
    }

    const newUser = createUser(type, data);

    try {
        await newUser.save()
        next();
    }

    catch (err) {
        console.log(`Erro ao cadastrar usuario ${err}`)
        const { code, message } = identifyError(err);
        res.status(code).json(message);
    }
}

function createUser(type, data) {
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
        return { code: 400, message: "Este usuário já existe" }
    }

    else {
        return { code: 500, message: "Erro ao cadastrar usuário" }
    }
}

async function login(req, res, next, type) {
    const { identifier, password } = req.body;
    req.type = type;

    try {
        const user = await getUser(identifier, type, res);

        if (!user) {
            res.status(404).json({ error: "Usuario não encontrado" });
            return;
        }

        const cryPassword = user.password;
        const uncryPassword = await bcrypt.compare(password, cryPassword);

        req.body.name = user.name;

        uncryPassword ? next() :
            res.status(401).json({ error: "Senha incorreta" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erro ao logar" });
    }
}

async function getUser(identifier, type, res) {
    let user = null;

    if (type === "client") {
        user = await Client.findOne({ email: identifier }).exec();
        console.log("cliente");
        console.log(user);
    }

    if (type === "supplier") {
        console.log("fornecedor");
        user = await Supplier.findOne({ cnpj: identifier }).exec();
        console.log(user);
    }

    return user;
}

module.exports = { signUp, login };
