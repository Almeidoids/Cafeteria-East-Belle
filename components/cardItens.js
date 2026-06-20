"use client"

import Image from "next/image";
import Link from "next/link";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/cardItens.module.css";

// Fontes
import { caveat } from "../public/fonts/fonts";

export default function CardItens({offer, image, title, price, link, edit}, key) {
    const promotion = ((price * offer) / 100).toFixed(2);
    
    return (
        <div className = {`${styles.card} ${caveat.variable}`}>
            {offer !== 0 && 
                <div className = {styles.algnOffer}>
                    <Image
                        src = "/images/etiqueta.png"
                        alt = ""
                        width = "5000"
                        height= "5000"
                        className = {styles.etiqueta}
                    />
                    <div className = {styles.desconto}>
                        <p className = {styles.txtDesconto}>{offer}%</p>
                    </div>
                </div>
            }

            <div className = {styles.border} style = {offer !== 0 ? {marginTop: "-36%"} : null}>
                <Image
                    src = {image}
                    alt = {title}
                    width = "350"
                    height = "350"
                    className = {styles.images}
                />
            </div>
            <h5 className = {styles.nomeProdutos}>{title}</h5>
            <p style = {caveat.style} className = {offer !== 0 ? styles.original : styles.preco}>{price}</p>
            {offer !== 0 &&
                <p style = {caveat.style} className = {styles.preco}>{(price - promotion).toFixed(2)}</p>
            }
            <Link href = {link} className = {styles.algnbtn}><button type = "button" className = {`btn btn-primary ${styles.botaoComprar}`} style = {{marginTop: offer === 0 ? "14px" : null}}>{edit ? "Editar" : "Comprar"}</button></Link>
        </div>
    )
}