const express = require("express");
const app = express.Router();

// UTIL
const connect = require("./util/connect");
const { getTkn } = require("./util/authentication");
const { Supplier } = require("./models/models");

app.get("/", getTkn, (req, res) => {
    const user = req.user;
    res.json({ user });
})

app.get("/supplier/:supplier", connect, async (req, res) => {
    const {supplier} = req.params;

    try {
        const dbSupplier = await Supplier.findOne({name: supplier}).exec();

        if (!dbSupplier) throw new Error();

        else res.json({id: dbSupplier._id});
    }

    catch (err) {
        res.status(500).json({err: "Erro ao capturar informaçẽos de conta"});
    }
})

module.exports = app;
