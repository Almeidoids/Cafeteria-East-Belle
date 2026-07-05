const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// UTIL
const connect = require("./util/connect");
const { getTkn, setTkn } = require("./util/authentication");
const { Supplier, Client } = require("./models/models");
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

app.route("/:type/:username/edit").get(connect, async (req, res) => {
    const { username, type } = req.params;
    let user = null;

    try {
        if (type === "client") {
            user = await Client.findOne({ name: username }).exec();
        }
        if (type === "supplier") {
            user = await Supplier.findOne({ name: username }).exec();
        }

        if (!user) return res.status(404).json({ err: "Usuário não encontrado!" });

        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
        };

        res.json({ data: data });
    }

    catch (err) {
        res.status(500).json({ err: "Erro ao editar usuário" });
    }
})
    .post(connect, async (req, res) => {
        const items = req.body;
        const { username, type } = req.params;

        if ("name" in items) {
            req.type = type;
            setTkn(req, res);
        }

        try {
            if (type === "client") {
                await Client.findOneAndUpdate({ name: username }, { $set: items });
            }
            if (type === "supplier") {
                await Supplier.findOneAndUpdate({ name: username }, { $set: items });
            }

            res.send("Sucesso");
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ err: "Erro ao atualizar usuario" });
        }
    })

app.get("/exit", (req, res) => {
    res.clearCookie("acessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.send("Limpeza concluida");
})

module.exports = app;
