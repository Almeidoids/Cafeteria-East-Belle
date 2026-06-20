"use client"

import { useContext, useEffect, useState, useRef } from "react";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/modalConfirm.module.css";

//Constants
import { Cart } from "../constants/carrinho";

//Funções
import { total, subQuantity } from "../util/buy";

//Fontes
import { candal, caveat } from "../public/fonts/fonts";
import produtos from "../constants/produtos";

export default function ModalConfirm({ setShowModal, children, onClick }) {
    const modalRef = useRef();

    return (
        <div className = {`${styles.algnModal} ${candal.variable}`}>
            <div className={styles.background} />

            <div className={styles.modal} ref={modalRef}>
                <div className={`${styles.header}`}  data-bs-theme = "dark">
                    <h5 className={`${styles.textHeader} ${candal.className}`} >Confirmação</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick = {() => {setShowModal(false)}} />
                </div>
                <div className={`${styles.body} ${caveat.className}`}>
                    {children}
                </div>
                <div className={`${styles.footer}`}>
                    <button type="button" className={`btn btn-secondary ${styles.btnCancel}`} onClick = {() => setShowModal(false) } >Cancelar</button>

                    <button
                        type="button"
                        className={`btn btn-primary ${styles.btnBuy} ${candal.className}`}
                        onClick={onClick}
                    >
                        Continuar
                    </button>

                </div>
            </div>
        </div>
    )
}

function Buy({ setCart, style, setVisible, visible, cart }) {

    useEffect(() => {
        if (visible === true) {
            cart.forEach(function (value) {
                produtos[value.id - 1].buyed += value.amount;
                produtos[value.id - 1].quantity = subQuantity(produtos[Number(value.id) - 1], value);
            })
            setCart([]);
            const offcanvas = document.querySelector("#offcanvasScrolling");
            offcanvas ? offcanvas.className = `${offcanvas.className} hiding` : null;
        }
    }, [visible]);

    return (
        <div className={`alert alert-success ${styles.alert}`} role="alert" style={style}>
            <div>
                <h4 style={candal.style}>Compra realizada!</h4>
            </div>
            <button type="button" className="btn-close" aria-label="close" onClick={() => { setVisible(false) }} />
        </div>
    )
}