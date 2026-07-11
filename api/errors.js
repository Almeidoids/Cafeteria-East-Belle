const express = require("express");
const HTTPErrors = require("./util/HTTPErrors");
const app = express.Router();

module.exports = ((err, req, res, next) => {
    if (err instanceof HTTPErrors) {
        return res.status(err.code).json({ err: err.message });
    }
    else {
        return res.status(500).json({ err: "Erro no servidor" });
    }
})