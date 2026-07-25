import mongoose from "mongoose";

const { Schema } = mongoose;

const SupplierSchema = new Schema({
    name: { type: String, unique: true, required: true, },
    email: { type: String, required: true, },
    cnpj_cpf: { type: String, unique: true, required: true, },
    address: { type: String, required: true, },
    password: { type: String, required: true, },
    active: { type: Boolean, required: true, default: false },
});

const ProductsSchema = new Schema({
    name: { type: String, required: true, },
    description: { type: String, required: true, },
    price: { type: String, required: true, },
    quantity: { type: Number, required: true, },
    offer: { type: Number, },
    images: [{ type: Buffer, }],
    buyed: { type: Number, required: true, },
    supplier: { type: Schema.Types.ObjectId, ref: "Fornecedores" },
    expireAt: { type: Date, expires: 0 },
});

const ClientSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    cpf: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
});

const Supplier = mongoose.model("Fornecedores", SupplierSchema);
const Products = mongoose.model("Produtos", ProductsSchema);
const Client = mongoose.model("Clientes", ClientSchema);

export { Supplier, Products, Client };