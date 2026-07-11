"use client"

import { useContext, useEffect, useState, createRef, useRef } from "react";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/carrinho.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Constantes
import { Cart } from "../constants/carrinho";
// import produtos from "../constants/produtos";

//Funções
import { total, subQuantity } from "../util/buy";

// Componentes
import ModalConfirm from "./modalConfirm";
import Alert from "./alert";

// Util
import createRefList from "../util/createRefList";

export default function Carrinho() {
    const { cart, setCart } = useContext(Cart);
    const [listBuy, setListBuy] = useState([]);
    const [save, setSave] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [alert, setAlert] = useState(null);
    const cartLength = cart.length;
    const liRefsDelete = useRef([]);
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
        createRefList(cart.length, liRefsDelete.current);
    }, [cart]);

    useEffect(() => {
        let num = 0;
        setListBuy(cart.map(item => {
            return (
                <li
                    style={{ display: "flex" }}
                    key={num++}
                    onMouseEnter={() => { liRefsDelete.current[cart.indexOf(item)].style.display = "block" }}
                    onMouseLeave={() => { liRefsDelete.current[cart.indexOf(item)].style.display = "none" }}
                >
                    <div className={styles.lista}>
                        <p style={{ pointerEvents: "none" }}>{item.amount} {item.product}</p>
                        <p style={{ pointerEvents: "none" }}>{item.price}</p>
                    </div>
                    <button
                        type="button"
                        className={`btn-close`}
                        style={{
                            marginLeft: 10,
                            display: "none"
                        }}
                        aria-label="Close"
                        ref={e => liRefsDelete.current[cart.indexOf(item)] = e}
                        onClick={() => {
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
        <div>
            <div className={`offcanvas offcanvas-end ${styles.carrinhoCorpo}`} data-bs-scroll="true" data-bs-backdrop="false" data-bs-theme="dark" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasScrollingLabel" style={{ color: "#CAC1C7" }}>Carrinho</h5>
                    <button type="button" className={`btn-close`} style={{ marginLeft: "auto" }} data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <ul className={styles.ul}>
                        {listBuy}
                        {cart.length > 0 &&
                            <li className={styles.lista}>
                                <p>Total</p>
                                <p>{price}</p>
                            </li>
                        }
                    </ul>
                    {cart.length > 0 &&
                        <div className={styles.algnBtn}>
                            <button className={`${styles.btnCancelar}`} onClick={() => {
                                setCart([]);
                            }}>Cancelar</button>
                            <button type="button" className={`${styles.btnComprar}`} onClick={() => setShowModal(true)}>Comprar</button>
                        </div>
                    }
                    <label style={{ marginTop: 20 }}>
                        <input type="checkbox" className={styles.checkbox} checked={save} onChange={(e) => setSave(e.target.checked)} /> Você deseja salvar o carrinho após sair do site?
                    </label>
                </div>
            </div>

            {showModal === true &&
                <ModalConfirm setShowModal = {setShowModal} onClick={() => openAlert(setAlert, cart, setCart, setShowModal)} >
                    <p className={styles.textBody} >Você realmente deseja efetuar esta compra? O valor será de: {price}</p>
                </ModalConfirm>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ display: alert ? "flex" : "none" }} />

        </div>
    )
}

async function openAlert(setAlert, cart, setCart, setShowModal) {
    const data = {cart};

    const res = await fetch("/products/buy", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const result = await res.json();
        setAlert(result.err);
    }

    else {
        setCart([]);
        const offcanvas = document.querySelector("#offcanvasScrolling");
        offcanvas ? offcanvas.className = `${offcanvas.className} hiding` : null;

        setAlert("Compra Efetuada");
        setShowModal(false);
    }
}