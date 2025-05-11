"use client"

import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/cardItens.module.css";
import { caveat } from "../public/fonts/fonts";
import { useEffect } from "react";
import Link from "next/link";

export default function CardItens({offer, image, title, original, link}, key) {
    const promotion = ((original * offer) / 100).toFixed(2);
    
    return (
        <div className = {`${styles.card} ${caveat.variable}`}>
            {offer !== 0 && 
                <>
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
                </>
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
            <p style = {caveat.style} className = {offer !== 0 ? styles.original : styles.preco}>{original}</p>
            {offer !== 0 &&
                <p style = {caveat.style} className = {styles.preco}>{(original - promotion).toFixed(2)}</p>
            }
            <Link href = {link}><button type = "button" className = {`btn btn-primary ${styles.botaoComprar}`} style = {{marginTop: offer === 0 ? "11%" : null}}>Comprar</button></Link>
        </div>
    )
}