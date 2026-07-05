const express = require("express");
const app = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer")
const upload = multer();

// UTIL
const connect = require("./util/connect");
const { setTkn } = require("./util/authentication");

//Constants
const { Supplier, Products} = require("./models/models");

app.use(express.json());

// Requisição Get para pegar informações do Fornecedor.
app.get("/fornecedor/get/:fornecedor", connect,

    // Função para pegar informações do fornecedor
    async function (req, res) {
        const name = req.params.fornecedor; // Pega o nome do fornecedor

        try {
            const supplier = await Supplier.findOne({ name: name }).exec(); // Encontra o fornecedor pelo nome no BD

            if (!supplier) return res.status(404).json({ error: "Usuario não encontrado" }); // Caso não encontre, retorna erro

            const products = await Products.find({ supplier: supplier._id }).exec();

            // Data é a váriavel que vai armazenar as informações do fornecedor que serão enviadas na resposta
            const data = {
                name: supplier.name,
                products: products.map(item => {
                    return {
                        id: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        buyed: item.buyed,
                        offer: item.offer,
                    }
                }),
            }

            res.json({ data: data }); // Envia a variavel data como resposta 
        }
        catch (err) { // Caso dê erro, retorna status 500, como a exceção na resposta
            console.log(err);
            res.status(500).json({ error: "Erro ao entrar" });
        }
    }
)

app.route("/fornecedor/produto").post(upload.array("image", 4), connect,

    async function (req, res) {
        const { name, description, price, quantity, offer, supplierName } = JSON.parse(req.body.items);
        const images = [];

        req.files.forEach(function (value) {
            images.push(value.buffer);
        })

        try {
            const supplier = await Supplier.findOne({ name: supplierName }).exec();

            const newProduct = new Products({
                name: name,
                description: description,
                price: price,
                quantity: Number(quantity),
                offer: Number(offer),
                images: images,
                supplier: supplier._id,
                buyed: 0,
            });

            req.product = await newProduct.save();
            res.send("Produto Salvo.");

        }
        catch (err) {
            res.status(500).json({ error: "Erro ao cadastrar produtos" });
        }
    }
)
.delete(connect, async (req, res) => {
    const name = req.params.fornecedor;

    try {
        const supplier = await Supplier.findOne({ name: name }).exec();

        await Products.deleteMany({ supplier: supplier._id });

        res.send("Sucesso");
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Erro ao deletar produto" });
    }
});

app.route("/fornecedor/:fornecedor/edit").get(connect, async (req, res) => {
    const { fornecedor } = req.params;

    try {
        const supplier = await Supplier.findOne({name: fornecedor}).exec();

        if (!supplier) return res.status(404).json({err: "Fornecedor não encontrado!"});

        const data = {
            id: supplier._id,
            name: supplier.name,
            email: supplier.email,
            address: supplier.address,
        };

        res.json({data: data});
    }

    catch (err) {
        res.status(500).json({ err: "Erro ao capturar os produtos" });
    }
})
.post(connect, async (req, res) => {
    const items = req.body;
    const { fornecedor } = req.params;

    if ("name" in items) {
        setTkn(req, res);
    }

    try {
        await Supplier.findOneAndUpdate({name: fornecedor}, {$set: items});

        res.send("Sucesso");
    }
    
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Erro ao atualizar Fornecedor" });
    }
})

app.post("/fornecedor/:fornecedor/edit/senha", connect, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const {fornecedor} = req.params;

    try {
        const supplier = await Supplier.findOne({name: fornecedor}).exec();

        if (!supplier) throw new Error();

        const verifyPassword = await bcrypt.compare(oldPassword, supplier.password);

        if (verifyPassword) {
            const cryPassword = await bcrypt.hash(newPassword, 10);

            supplier.password = cryPassword;
            await supplier.save();

            res.send("Sucesso");
        }

        else {
            res.status(401).json({error: "Uma das senhas é inválida"});
        }
    }

    catch (err) {
        res.status(500).json({error: "Erro ao trocar senha"});
    }
})

app.route("/fornecedor/produto/edit/:id").get(connect, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Products.findById(id).exec();

        if (!product) return res.status(404).json({err: "Produto não encontrado!"});

        const data = {
            id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            offer: product.offer,
            images: product.images
        };

        res.json({data: data});
    }

    catch (err) {
        res.status(500).json({ err: "Erro ao capturar os produtos" });
    }
})
.post(upload.array("image", 4), connect, async (req, res) => {
    console.log(req.body);
    const items = JSON.parse(req.body.items);
    const images = [];
    const { id } = req.params;

    req.files.forEach(function (value) {
        images.push(value.buffer);
        items.images = images;
    })

    try {
        await Products.findByIdAndUpdate(id, {$set: items});

        res.send("Sucesso");
    }
    
    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Erro ao atualizar produto" });
    }
})

app.post("/fornecedor/:fornecedor/editAll", connect, async (req, res) => {
    const listEdit = req.body;

    console.log(listEdit);

    const operation = listEdit.map(item => {
        const editQuery = {updateOne: {filter: {}, update: {$set: {}}}};
        const result = Object.entries(item).map(([key, val]) => {
            if (key === "_id") {
                editQuery.updateOne.filter = {[key] : val};
            }
            else {
                editQuery.updateOne.update.$set[key] = val;
            }
        });

        console.dir(editQuery, {depth: null});
        return (editQuery);
    })

    try {
        await Products.bulkWrite(operation);
        res.send("Sucesso");
    }

    catch (err) {
        res.status(500).json({err: "Não foi possivel salvar produtos"});
        console.log(err);
    }
})

app.delete("/fornecedor/produto/delete/:id", connect, async (req, res) => {
    const { id } = req.params;

    try {
        await Products.findByIdAndDelete(id);

        res.send("sucesso");
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Erro ao deletar produto" });
    }
})

app.get("/exit", (req, res) => {
    res.clearCookie("acessToken", {path: "/"});
    res.clearCookie("refreshToken", {path: "/"});

    console.log(req.headers.cookie);

    res.send("Limpeza concluida");
})

module.exports = app;
