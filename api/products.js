const express = require("express");
const app = express.Router();

// UTIL
const connect = require("./util/connect");

// Constants 
const { Supplier, Products } = require("./models/models");
const HTTPErrors = require("./util/HTTPErrors");

app.use(express.json());

app.get("/", connect,

    async function (req, res, next) {
        try {
            const listProducts = await Products.find().limit(20).where("quantity").gt(0).exec();

            if (!listProducts) {
                throw new HTTPErrors("Erro ao listar produtos. Produtos não encontrados", 404);
            }

            const data = {
                products: listProducts.map(item => {
                    return {
                        name: item.name,
                        price: item.price,
                        offer: item.offer,
                        image: item.images[0],
                        key: item._id,
                        supplier: item.supplier
                    }
                })
            }

            res.json(data);
        }

        catch (err) {
            next(err);
        }
    })

app.get("/:id", connect, async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = await Products.findById(id).exec();

        if (!product) {
            throw new HTTPErrors("Produto não encontrado", 404);
        }

        res.json({ product: product });
    }

    catch (err) {
        next(err);
    }
})

app.post("/buy", connect, async (req, res, next) => {
    const { cart } = req.body;

    try {
        for (const value of cart) {
            const product = await Products.findById(value.id).exec();

            if (!product) {
                throw new HTTPErrors("Produtos não encontrados", 404);
            }

            product.buyed += value.amount;
            product.quantity -= value.amount;

            if (product.quantity < 0) {
                throw new HTTPErrors("Erro na compra", 400);
            }
            else {
                await product.save();
            }
        }

        res.send("Sucesso na compra");
    }
    catch (err) {
        next(err);
    }
})

module.exports = app;