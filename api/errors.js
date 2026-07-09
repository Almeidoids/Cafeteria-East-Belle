const express = require("express");
const app = express.Router();

app.use(express.json());

app.use((err, req, res, next) => {
    if (err instanceof HttpErrors) {
        return res.status(err.code).json({ err: err.message });
    }
    else {
        return res.status(500).json({ err: "Erro no servidor" });
    }
})

module.exports = app;
