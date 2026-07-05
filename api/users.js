const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// Util
const connect = require("./util/connect");
const { setTkn, getTkn } = require("./util/authentication");
const { signUp, login } = require("./util/loginOrSign");

// Models
const { Client } = require("./models/models");


app.use(express.json());

app.post("/cadastro", connect,

    async function (req, res, next) {
        signUp(req, res, next, "client");
    },
    setTkn);

app.post("/login", connect,

    async function (req, res, next) {
        login(req, res, next, "client");
        // const { email, password } = req.body;
        // req.type = "client";
        //
        // try {
        //     const client = await Client.findOne({ email: email }).exec();
        //
        //     if (!client) res.status(404).json({ error: "Usuario não encontrado" });
        //
        //     const cryPassword = client.password;
        //     const uncryPassword = await bcrypt.compare(password, cryPassword);
        //
        //     req.body.name = client.name;
        //
        //     uncryPassword ? next() :
        //         res.status(401).json({ error: "Senha incorreta" });
        // }
        // catch (err) {
        //     console.log(err);
        //     res.status(500).json({ error: "Erro ao logar" });
        // }
    },
    setTkn);

app.route("/:user/edit").get(connect, async (req, res) => {
    const { user } = req.params;

    try {
        const client = await Client.findOne({ name: user }).exec();

        if (!client) return res.status(404).json({ err: "Usuário não encontrado!" });

        const data = {
            id: client._id,
            name: client.name,
            email: client.email,
            address: client.address,
        };

        res.json({ data: data });
    }

    catch (err) {
        res.status(500).json({ err: "Erro ao capturar os produtos" });
    }
})
    .post(connect, async (req, res) => {
        const items = req.body;
        const { user } = req.params;

        if ("name" in items) {
            req.type = "client";
            setTkn(req, res);
        }

        try {
            await Client.findOneAndUpdate({ name: user }, { $set: items });

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

    console.log(req.headers.cookie);

    res.send("Limpeza concluida");
})


module.exports = app;
