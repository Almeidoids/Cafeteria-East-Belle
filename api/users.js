const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");

// Util
const connect = require("./util/connect");
const { setTkn, getTkn } = require("./util/authentication");

// Models
const { Client } = require("./models/models");


app.use(express.json());

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
