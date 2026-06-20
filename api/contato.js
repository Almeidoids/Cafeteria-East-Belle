const express = require("express");
const nodemailer = require("nodemailer");
const app = express.Router();

app.use(express.json());

app.post("/", async function (req, res, next) {
    console.log(await req.body);
    req.name = req.body.Nome;
    req.lastName = req.body.Sobrenome;
    req.email = req.body.Email;

    req.transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,

        auth: {
            user: "cafeteriaeastbelle@gmail.com",
            pass: process.env.email,
        }
    });

    next();
}, function (req, res) {
    req.transport.sendMail({
        from: "Cafeteria East Belle <cafeteriaeastbelle@gmail.com>",
        to: req.email,
        subject: `Obrigado por fazer sua pergunta`,
        html: `<p>Obrigado por fazer sua pergunta ${req.name} ${req.lastName}, logo iremos responde-lá.</p>`,
        text: `Obrigado por fazer sua pergunta ${req.name} ${req.lastname}, logo iremos responde-lá.`,
    })
    .then(() => res.json({text: "email enviado"}))
    .catch((err) => res.status(500).json({text: `Erro ao enviar email`}));
})

module.exports = app;