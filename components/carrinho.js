"use client"

import { useContext, useEffect, useState, createRef, useRef } from "react";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/carrinho.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Constantes
import { Cart } from "../constants/carrinho";

//Funções
import { total } from "../functions/buy";

export default function Carrinho() {
    const {cart, setCart} = useContext(Cart);
    const cartLength = cart.length;
    const [listBuy, setListBuy] = useState([]);
    const liRefsDelete = useRef([]);
    const [save, setSave] = useState(false);
    const price = total(cart);

    useEffect(() => {
        if (localStorage.getItem("0") === null) {
            return;
        }
        else {
            setCart([]);
            const itemString = localStorage.getItem("0");
            const toRecover = JSON.parse(itemString);
            setCart(toRecover);
            setSave(JSON.parse(localStorage.getItem("1")));
        }
    }, [])

    useEffect(() => {
        if (cart.length === 0) return;
        else { 
            liRefsDelete.current = Array(cartLength).fill().map((_, i) => {
                liRefsDelete.current[i] || createRef();
            });
        }
    }, [cart]);

    useEffect(() => {
        let num = 0;
        setListBuy(cart.map(item => {
            return (
                <li 
                    style = {{display: "flex"}} 
                    key = {num++} 
                    onMouseEnter = {() => {liRefsDelete.current[cart.indexOf(item)].style.display = "block"}}
                    onMouseLeave = {() => {liRefsDelete.current[cart.indexOf(item)].style.display = "none"}} 
                >
                    <div className = {styles.lista}>
                        <p style = {{pointerEvents: "none"}}>{item.amount} {item.product}</p>
                        <p style = {{pointerEvents: "none"}}>{item.price}</p>
                    </div>
                    <button 
                        type = "button" 
                        className = {`btn-close`} 
                        style = {{marginLeft: 10, 
                        display: "none"}} 
                        aria-label = "Close"
                        ref = {e => liRefsDelete.current[cart.indexOf(item)] = e}
                        onClick = {() => {
                            setCart(cart.filter(value => value !== item))
                        }}
                    />
                </li>
            )
        }));
    }, [cart])

    useEffect(() => {
        if (save) {
            const toSave = JSON.stringify(cart);
            const saveToSave = JSON.stringify(save);
            localStorage.setItem("0", toSave);
            localStorage.setItem("1", saveToSave);
        }
        else {
            localStorage.removeItem("0");
            localStorage.setItem("1", JSON.stringify(save));
        }
    }, [listBuy, save])

    return (
            <div className = {`offcanvas offcanvas-end ${styles.carrinhoCorpo}`} data-bs-scroll = "true" data-bs-backdrop = "false" data-bs-theme = "dark" tabIndex = "-1" id = "offcanvasScrolling" aria-labelledby = "offcanvasScrollingLabel">
                <div className = "offcanvas-header">
                    <h5 className = "offcanvas-title" id = "offcanvasScrollingLabel" style = {{color: "#CAC1C7"}}>Carrinho</h5>
                    <button type = "button" className = {`btn-close`} style = {{marginLeft: "auto"}} data-bs-dismiss = "offcanvas" aria-label = "Close"/>
                </div>
                <div className = "offcanvas-body">
                    <ul className = {styles.ul}>
                        {listBuy}
                        {cart.length > 0 && 
                            <li className = {styles.lista}>
                                <p>Total</p>
                                <p>{price}</p>
                            </li>
                        }
                    </ul>
                    {cart.length > 0 &&
                        <div style = {{justifySelf: "flex-end"}}>
                            <button className = {`${styles.btnCancelar}`} onClick = {() => {
                                setCart([]);
                            }}>Cancelar</button>
                            <button type = "button" className = {`${styles.btnComprar}`} data-bs-toggle = "modal" data-bs-target = "#staticBackdrop">Comprar</button>
                        </div>
                    }
                    <label style = {{marginTop: 20}}>
                        <input type = "checkbox" className = {styles.checkbox} checked = {save} onChange = {(e) => setSave(e.target.checked)} /> Você deseja salvar o carrinho após sair do site?
                    </label>
                </div>
            </div>
    )
}
