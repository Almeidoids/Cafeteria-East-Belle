"use client"

import { useContext, useEffect, useState, useRef } from "react";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/modalConfirm.module.css";

//Constants
import { Cart } from "../constants/carrinho";

//Funções
import { total, subQuantity } from "../functions/buy";

//Fontes
import { candal } from "../public/fonts/fonts";
import produtos from "../constants/produtos";

export default function ModalConfirm() {
    const {cart, setCart} = useContext(Cart);
    const [sum, setSum] = useState(0);
    const [visible, setVisible] = useState(false);
    const modalRef = useRef()
    
    useEffect(() => {
        setSum(total(cart));
    }, [cart]);

    return (
        <>
            <div className = "modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" ref = {modalRef}>
                <div className = "modal-dialog">
                    <div className = "modal-content">
                        <div className = {`modal-header ${styles.header}`} data-bs-theme = "dark" >
                            <h1 className = {`modal-title fs-5 ${styles.textHeader}`} id = "staticBackdropLabel">Confirmação da compra</h1>
                            <button type = "button" className = "btn-close" data-bs-dismiss = "modal" aria-label = "Close" />
                        </div>
                        <div className = {`modal-body ${styles.body}`}>
                            <p className = {styles.textBody}>Você realmente deseja efetuar esta compra? O total será de {sum}</p>
                        </div>
                        <div className = {`modal-footer ${styles.footer}`}>
                        <button type = "button" className = {`btn btn-secondary ${styles.btnCancel}`} data-bs-dismiss = "modal">Cancelar</button>
                        <button 
                            type = "button" 
                            className = {`btn btn-primary ${styles.btnBuy}`} 
                            data-bs-dismiss = "modal" 
                            onClick = {() => setVisible(true)} 
                        >Comprar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Buy setCart = {setCart} style = {{display: visible ? "flex" : "none"}} setVisible = {setVisible} visible = {visible} cart = {cart} />
        </>
    )
}

function Buy({setCart, style, setVisible, visible, cart}) {

    useEffect(() => {
        if (visible === true) { 
            cart.forEach(function(value) {
                produtos[value.id - 1].buyed += value.amount;
                produtos[value.id - 1].quantity = subQuantity(produtos[Number(value.id) - 1], value);
            })
            setCart([]);
            const offcanvas = document.querySelector("#offcanvasScrolling");
            offcanvas ? offcanvas.className = `${offcanvas.className} hiding` : null;
        }
    }, [visible]);

    return(
        <div className = {`alert alert-success ${styles.alert}`} role = "alert" style = {style}>
            <div>
                <h4 style = {candal.style}>Compra realizada!</h4>
            </div>
            <button type = "button" className = "btn-close" aria-label = "close" onClick = {() => {setVisible(false)}} />
        </div>
    )
}