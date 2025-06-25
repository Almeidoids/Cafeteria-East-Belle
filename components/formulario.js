"use client"

import Form from "next/form";
import { useContext, useEffect, useState, useRef } from "react";

//Estilos
import styles from "../style/formulario.module.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Constants 
import {Cart} from "../constants/carrinho";
import produtos from "../constants/produtos";

//Funcoes
import { subQuantity } from "../functions/buy";

export default function Formulario({product}) {
    const {cart, setCart} = useContext(Cart);
    const [cartLength, setCartLength] = useState(cart.length);
    const refInput = useRef();
    const refButton = useRef();

    useEffect(() => {
        if (cartLength !== cart.length) {
            product.quantity = produtos[product.key - 1].quantity;
            
            cart.forEach(function (value) {
                product.key === value.id ?
                product.quantity = subQuantity(product, value) : null;
            })
            setCartLength(cart.length);
        }

        if (product.quantity <= 0){ 
            refInput.current.disabled = true;
            refButton.current.disabled = true;
        }
        else {
            refInput.current.disabled = false;
            refButton.current.disabled = false;
        }

        if (product.quantity > produtos[product.key - 1].quantity){ 
            product.quantity = produtos[product.key - 1].quantity;
            refInput.current.max = product.quantity;
        }
    }, [cart]);

    return (
        <>
            <Form onSubmit = {(e) => addCart(e, product, setCart, setCartLength)} className = {styles.comprar}>
                <input 
                    type = "number" 
                    name = "numProducts" 
                    min = {1}
                    max = {product.quantity}
                    defaultValue = {1}
                    ref = {refInput}
                    className = {styles.numProdutos} 
                />
                 <button 
                    type = "submit" 
                    className = {`btn btn-primary ${styles.botaoComprar}`}
                    name = "add"
                    ref = {refButton}
                >{product.quantity <= 0 ? "Produto fora de estoque" : `Adicionar ao Carrinho`} 
                    {product.quantity > 0 &&
                        <i className = {`bi bi-cart4 ${styles.icone}`} />
                    }
                </button>
            </Form>
        </>
    )
}

export  function addCart(e, product, setContext, setLength) {
    e.preventDefault();
    let numBuy = e.target.querySelector("input").value;
    const subtract = ((product.originalp * product.offer) / 100).toFixed(2)
    const valueProduct = (product.originalp - Number(subtract)).toFixed(2);
    const totalValue = (Number(valueProduct) * numBuy).toFixed(2);
    let arrayC = [];

    setContext(prevState => {
        const result = [...prevState, {amount: Number(numBuy), product: product.name, price: totalValue, id: product.key}]
        arrayC = result;
        return result;
    });

    product.quantity = produtos[product.key - 1].quantity;
    
    arrayC.forEach(function (value) {
        product.key === value.id ?
        product.quantity = subQuantity(product, value) : null;
    })

    setLength(arrayC.length);

    e.target.querySelector("input").value = 1;
}