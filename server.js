const express = require("express");
const next = require("next");

//Outros arquivos back-end
const contact = require("./api/contato");
const merchant = require("./api/comercial");
const products = require("./api/products");
const authenticate = require("./api/authenticate");

//Começo do código
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use("/api/launchEmail", contact);
    server.use("/comercial", merchant);
    server.use("/products", products);
    server.use("/authenticate", authenticate);

    server.get("/api/myapi", (req, res) => {
        res.json({ msg: "Esta é uma resposta do express usando seu servidor personalizado" })
    })

    server.get("/{*splat}", (req, res) => {
        return handle(req, res);
    })

    //Começa a usar o servidor express
    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("Express rondando no port 3000");
    })
})