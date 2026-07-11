const express = require("express");
const app = express.Router();
const multer = require("multer")
const upload = multer();

// UTIL
const connect = require("./util/connect");

//Constants
const { Supplier, Products} = require("./models/models");
const HTTPErrors = require("./util/HTTPErrors");

app.use(express.json());

// Requisição Get para pegar informações do Fornecedor.
app.get("/fornecedor/get/:fornecedor", connect,

    // Função para pegar informações do fornecedor
    async function (req, res, next) {
        const name = req.params.fornecedor; // Pega o nome do fornecedor

        try {
            const supplier = await Supplier.findOne({ name: name }).exec(); // Encontra o fornecedor pelo nome no BD

            if (!supplier) throw new HTTPErrors("Usuário não encontrado", 404)

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
            next(err)
        }
    }
)

app.route("/fornecedor/produto").post(upload.array("image", 4), connect,

    async function (req, res, next) {
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
            next(err);
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
        next(err);
    }
});

app.route("/fornecedor/produto/edit/:id").get(connect, async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Products.findById(id).exec();

        if (!product) throw new HTTPErrors("Produto não encontrado.", 404);

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
        next(err);
    }
})
.post(upload.array("image", 4), connect, async (req, res, next) => {
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
        next(err);
    }
})

app.post("/fornecedor/:fornecedor/editAll", connect, async (req, res) => {
    const listEdit = req.body;
    
    const operation = listEdit.map(item => {
        const editQuery = {updateOne: {filter: {}, update: {$set: {}}}};
        
        Object.entries(item).map(([key, val]) => {
            if (key === "_id") {
                editQuery.updateOne.filter = {[key] : val};
            }
            else {
                editQuery.updateOne.update.$set[key] = val;
            }
        });

        return (editQuery);
    })

    try {
        await Products.bulkWrite(operation);
        res.send("Sucesso");
    }

    catch (err) {
        next(err);
    }
})

app.delete("/fornecedor/produto/delete/:id", connect, async (req, res) => {
    const { id } = req.params;
    try {
        await Products.findByIdAndDelete(id);
        res.send("sucesso");
    }
    catch (err) {
        next(err);
    }
})

module.exports = app;
