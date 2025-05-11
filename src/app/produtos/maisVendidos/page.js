"use client"

import { candal } from "../../../../public/fonts/fonts";

//Códigos
import produtos from "../../../../constants/produtos";

//Componentes
import Menu from "../../../../components/menu";
import Rodape from "../../../../components/rodape";
import CardItens from "../../../../components/cardItens";
//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../../../style/ofertas.module.css"
import { useEffect, useState } from "react";


export default function maisVendidos() {
    const [lista,  setLista] = useState(produtos.toSorted((a, b) => b.buyed - a.buyed));
    const [maisVendidos, setMaisVendidos] = useState();

    useEffect(() => {
        setLista(produtos.toSorted((a, b) => b.buyed - a.buyed));
        setMaisVendidos(lista.map(item => {
            return (
                <CardItens
                    key = {item.key}
                    offer = {item.offer}
                    image = {item.image}
                    title = {item.name}
                    original = {item.originalp}
                    link = {`/produtos/${item.key}`}
                />
            );
        }))
    }, [produtos])

    return(
        <div style = {candal.style}>
            <Menu style = {{position: "fixed", zIndex: 2}} />
            <div style = {{justifyItems: "center"}}>
                <div className = {styles.organizacaoProdutos}>
                    {maisVendidos}
                </div>
            </div>
            <Rodape style = {{marginTop: "5%"}}/>
        </div>
    )
}