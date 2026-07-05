const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// UTIL
const connect = require("./util/connect");
const { getTkn, setTkn } = require("./util/authentication");
const { Supplier } = require("./models/models");
const { createUser, identifyError, getUser } = require("./util/loginOrSign");

app.use(express.json());

app.get("/", getTkn, (req, res) => {
    const user = req.user;
    res.json({ user });
})

app.get("/supplier/:supplier", connect, async (req, res) => {
    const { supplier } = req.params;

    try {
        const dbSupplier = await Supplier.findOne({ name: supplier }).exec();

        if (!dbSupplier) throw new Error();

        else res.json({ id: dbSupplier._id });
    }

    catch (err) {
        res.status(500).json({ err: "Erro ao capturar informaçẽos de conta" });
    }
})

app.post("/cadastro", connect,

    async function (req, res, next) {
        let { name, address, password, email, identityDocument, type } = await req.body;
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
    },
    setTkn);

app.post("/login", connect,
    async function (req, res, next) {
        const { identifier, password, type } = req.body;
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
            res.status(500).json({ error: "Erro ao logar" });
        }
    },
    setTkn);

module.exports = app;
