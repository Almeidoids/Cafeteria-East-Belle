const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// UTIL
const connect = require("./util/connect");
const { getTkn, setTkn } = require("./util/authentication");
const { Supplier, Client } = require("./models/models");
const { createUser, identifyError, getUser } = require("./util/loginOrSign");
const HTTPErrors = require("./util/HTTPErrors");

app.use(express.json());

app.get("/", getTkn, (req, res) => {
    const user = req.user;
    res.json({ user });
})

app.get("/supplier/:supplier", connect, async (req, res) => {
    const { supplier } = req.params;

    try {
        const dbSupplier = await Supplier.findOne({ name: supplier }).exec();

        if (!dbSupplier) throw new HTTPErrors("Fornecedor não encontrado", 404);

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
            cnpj_cpf: identityDocument
        }

        const newUser = createUser(type, data);

        try {
            await newUser.save()
            next();
        }

        catch (err) {
            const { code, message } = identifyError(err);
            res.status(code).json(message);
        }
    },
    setTkn
);

app.post("/login", connect,
    async function (req, res, next) {
        const { identityDocument, password, type } = req.body;
        req.type = type;

        try {
            const user = await getUser(identityDocument, type, res);

            if (!user) {
                throw new HTTPErrors("Usuario não encontrado", 404);
            }

            const cryPassword = user.password;
            const uncryPassword = await bcrypt.compare(password, cryPassword);

            req.body.name = user.name;

            if (!uncryPassword) {
                throw new HTTPErrors("Senha incorreta", 401);
            }

            next()
        }
        catch (err) {
            next(err);
        }
    },
    setTkn
);

app.route("/:type/:username/edit").get(connect, async (req, res, next) => {
    const { username, type } = req.params;
    let user = null;

    try {
        if (type === "client") {
            user = await Client.findOne({ name: username }).exec();
        }
        if (type === "supplier") {
            user = await Supplier.findOne({ name: username }).exec();
        }

        if (!user) throw new HTTPErrors("Usuario não encontrado", 404);

        const data = {
            id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
        };

        res.json({ data: data });
    }

    catch (err) {
        next(err);
    }
})
    .post(connect, async (req, res) => {
        const items = req.body;
        const { username, type } = req.params;

        try {
            let user = null;

            if (type === "client") {
                user = await Client.findOneAndUpdate({ name: username }, { $set: items });
            }
            if (type === "supplier") {
                user = await Supplier.findOneAndUpdate({ name: username }, { $set: items });
            }
            
            if ("name" in items) {
                req.type = type;
                setTkn(req, res);
            }

            res.send("Sucesso");
        }

        catch (err) {
            next(err);
        }
    }
)

app.post("/:type/:username/edit/senha", connect, async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { username, type } = req.params;
    let user = null;

    try {
        if (type === "supplier") {
            user = await Supplier.findOne({ name: username }).exec();
        }
        if (type === "client") {
            user = await Client.findOne({ name: username }).exec();
        }

        if (!user) throw new HTTPErrors("Usuario não encontrado", 404);

        const verifyPassword = await bcrypt.compare(oldPassword, user.password);

        if (verifyPassword) {
            const cryPassword = await bcrypt.hash(newPassword, 10);

            user.password = cryPassword;
            await user.save();

            res.send("Sucesso");
        }

        else {
            throw new HTTPErrors("Senha incorreta", 401);
        }
    }

    catch (err) {
        next(err);
    }
})

app.post("/sendVerifyEmail", getTkn, async (req, res) => {
    const type = req.user.type;
    try {
        if (type === "supplier") {
            user = await Supplier.findOne({ name: username }).exec();
            req.identityDocument = user.cnpj_cpf;
        }
        if (type === "client") {
            user = await Client.findOne({ name: username }).exec();
            req.identityDocument = user.cpf;
        }

        if (!user) throw new HTTPErrors("Usuario não encontrado", 404);

        next();
    }
    catch (err) {
        next(err);
    }
}, setVerifyAccountTkn,
function(req, res) {

})

app.get("/exit", (req, res) => {
    res.clearCookie("acessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.send("Limpeza concluida");
})

module.exports = app;
