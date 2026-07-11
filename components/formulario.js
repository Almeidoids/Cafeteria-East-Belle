"use client"

import { useContext, useEffect, useState, useRef } from "react";

//Estilos
import styles from "../style/formulario.module.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Constants 
import {Cart} from "../constants/carrinho";

//Funcoes
import { subQuantity } from "../util/buy";

export default function Formulario({product}) {
    const {cart, setCart} = useContext(Cart);
    const [cartLength, setCartLength] = useState(cart.length);
    const [cpProduct, setCpProduct] = useState(structuredClone(product));

    const refInput = useRef();
    const refButton = useRef();

    useEffect(() => {
        console.log(cpProduct.quantity);
        if (cartLength !== cart.length) {
            cpProduct.quantity = product.quantity;
            
            cart.forEach(function (value) {
                cpProduct._id === value.id ?
                cpProduct.quantity = subQuantity(cpProduct, value) : null;
            })
            setCartLength(cart.length);
        }

        if (cpProduct.quantity <= 0){ 
            refInput.current.disabled = true;
            refButton.current.disabled = true;
        }
        else {
            refInput.current.disabled = false;
            refButton.current.disabled = false;
        }

        if (cpProduct.quantity > product.quantity){ 
            cpProduct.quantity = product.quantity;
            refInput.current.max = cpProduct.quantity;
        }
    }, [cart]);

    return (
        <>
            <form onSubmit = {(e) => addCart(e, product, cpProduct, setCart, setCartLength)} className = {styles.comprar}>
                <input 
                    type = "number" 
                    name = "numProducts" 
                    min = {1}
                    max = {cpProduct.quantity}
                    defaultValue = {1}
                    ref = {refInput}
                    className = {styles.numProdutos} 
                />
                 <button 
                    type = "submit" 
                    className = {`btn btn-primary ${styles.botaoComprar}`}
                    name = "add"
                    ref = {refButton}
                >{cpProduct.quantity <= 0 ? "Produto fora de estoque" : `Adicionar ao Carrinho`} 
                    {cpProduct.quantity > 0 &&
                        <i className = {`bi bi-cart4 ${styles.icone}`} />
                    }
                </button>
            </form>
        </>
    )
}

export  function addCart(e, product, cpProduct, setContext, setLength) {
    e.preventDefault();
    console.log(product.quantity);
    let numBuy = e.target.querySelector("input").value;
    const subtract = ((cpProduct.price * cpProduct.offer) / 100).toFixed(2);
    const valueProduct = (cpProduct.price - Number(subtract)).toFixed(2);
    const totalValue = (Number(valueProduct) * numBuy).toFixed(2);
    let arrayC = [];

    setContext(prevState => {
        const result = [...prevState, {amount: Number(numBuy), product: cpProduct.name, price: totalValue, id: cpProduct._id}]
        arrayC = result;
        return result;
    });

    cpProduct.quantity = product.quantity;
    
    arrayC.forEach(function (value) {
        if (cpProduct._id === value.id) {
            cpProduct.quantity = subQuantity(cpProduct, value);
        }
    })

    setLength(arrayC.length);

    e.target.querySelector("input").value = 1;
    console.log(cpProduct.quantity);

}