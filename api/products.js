const express = require("express");
const app = express.Router();

// UTIL
const connect = require("./util/connect");

// Constants 
const { Supplier, Products } = require("./models/models");

app.use(express.json());

app.get("/", connect,

    async function (req, res) {
        try {
            const listProducts = await Products.find().limit(20).where("quantity").gt(0).exec();

            const data = {
                products: listProducts.map(item => {
                    return {
                        name: item.name,
                        price: item.price,
                        offer: item.offer,
                        image: item.images[0],
                        key: item._id,
                        supplierId: item.supplier
                    }
                })
            }

            res.json(data);
        }

        catch (err) {
            console.log(err);
            res.status(500).json({ err: "Erro ao listar produtos" });
        }
    })

app.get("/:id", connect, async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Products.findById(id).exec();

        if (!product) res.status(404).json("Produto não encontrado")

        res.json({ product: product });
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err: "Erro ao capturar produto" });
    }
})

app.post("/buy", connect, (req, res) => {
    console.log(req.body);
    const { cart } = req.body;
    console.log(req.body);
    console.log(cart);

    cart.forEach(async function (value) {
        try {
            const product = await Products.findById(value.id).exec();

            if (!product) return res.status(404).json({ err: "Produto não encontrado" });

            product.buyed += value.amount;
            product.quantity -= value.amount;

            if (product.quantity < 0) {
                return res.status(400).json({ err: "Erro na compra" });
            }

            else {
                await product.save();
                res.send("Sucesso na compra");
            }
        }

        catch (err) {
            res.status(500).json({err: "Erro na compra"});
        }
    })
})

module.exports = app;