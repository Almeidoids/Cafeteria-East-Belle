const express = require("express");

//Outros arquivos back-end
const contact = require("./api/contato");
const merchant = require("./api/comercial");
const products = require("./api/products");
const account = require("./api/account");
const errors = require("./api/errors");

const app = express();

app.use("/api/launchEmail", contact);
app.use("/comercial", merchant);
app.use("/products", products);
app.use("/account", account);
app.use(errors);

app.get("/api/myapi", (req, res) => {
    res.json({ msg: "Esta é uma resposta do express usando seu servidor personalizado" })
})

//Começa a usar o servidor express
app.listen(3000, (err) => {
    if (err) throw err;
    console.log("Express rondando no port 3000");
})

module.exports = app;