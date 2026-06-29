const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// Util
const connect = require("./util/connect");
const { setTkn, getTkn } = require("./util/authentication");

// Models
const { Client } = require("./models/models");


app.use(express.json());

app.post("/cadastro", connect,

    async function(req, res, next) {
        const { name, email, cpf, address, password } = req.body;
        req.type = "client";

        const cryPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({ name: name, email: email, cpf: cpf, address: address, password: cryPassword });

        try {
            await newClient.save()
            console.log("Usuario salvo");
            next();
        }

        catch (err) {
            console.log(`Erro ao cadastrar usuario ${err}`)

            if (err.code === 11000) {
                res.status(400).json({ error: "Este Cliente já existe" });
            }

            else {
                res.status(500).json({ error: "Erro ao cadastrar Cliente" });
            }
        }
    },
    setTkn);

app.post("/login", connect,

    async function(req, res, next) {
        const { email, password } = req.body;
        req.type = "client";

        try {
            const client = await Client.findOne({ email: email }).exec();

            if (!client) res.status(404).json({ error: "Usuario não encontrado" });

            const cryPassword = client.password;
            const uncryPassword = await bcrypt.compare(password, cryPassword);

            req.body.name = client.name;

            uncryPassword ? next() :
                res.status(401).json({ error: "Senha incorreta" });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: "Erro ao logar" });
        }

    },
    setTkn)


module.exports = app;
