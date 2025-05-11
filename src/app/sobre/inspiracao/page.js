"use client"

import { useRef, useEffect } from "react"
import Image from "next/image";

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape";

//Estilos
import styles from "../../../../style/sobre.module.css";

//Fontes
import { candal } from "../../../../public/fonts/fonts";

export default function Inspiracao() {
    const menu = useRef(null);

    useEffect(() => {
        menu.current.style.position = "fixed";
        menu.current.style.top = 0;
        menu.current.style.zIndex = 2;
    }, []);

    return (
        <div style = {candal.style}>
            <Menu ref = {menu} />
            <div className = {styles.organizacao}>
                <div className = {styles.fundotxtEsq}>
                    <h4 className = "title2">A Magia por Trás da East-Belle: Uma Viagem Cinematográfica</h4>
                    <p className = "text">Se você já se sentiu como se estivesse em um filme, daqueles que te fazem sorrir e suspirar ao mesmo tempo, então vai entender a nossa inspiração. A Cafeteria East-Belle nasceu de um desejo profundo de criar um espaço onde a magia do cinema se encontrasse com o aconchego de um café.</p>
                    <h4 className = "title2">"O Fabuloso Destino de Amelie Poulain": A Faísca da Inspiração</h4>
                    <p className = "text">Assim como no filme "O Fabuloso Destino de Amelie Poulain", buscamos referências em cada detalhe:</p>
                    <ul className = "list">
                        <li>As cores vibrantes e alegres: que nos remetem à energia contagiante da personagem principal, Amelie.</li>
                        <li>Os objetos vintage e excêntricos: que nos transportam para um universo paralelo de sonhos e fantasias, assim como no quarto de Amelie.</li>
                        <li>A trilha sonora francesa: que embala cada gole de café e cada conversa, criando uma atmosfera única e convidativa.</li>
                    </ul>
                </div>
                <Image 
                    src = "/images/sobre/inspiracao/filme.jpg"
                    alt = "cena do Filme: O Fabuloso Destino de Amelie Poulain."
                    width = {1000}
                    height = {1000}
                    className = {styles.imagem}
                />
                <Image 
                    src = "/images/sobre/cafeteriaEastBelle.jpg"
                    alt = "Uma das unidades da Cafeteria East-Belle"
                    width = {1000}
                    height = {1000}
                    className = {styles.imagem}
                />
                <div className = {styles.fundotxtEsq} style = {{marginBottom: "5%"}}>
                    <h4 className = "title2">Mais do que um Café, um Portal para Outro Mundo</h4>
                    <p className = "text">Mais do que um simples café, a East-Belle é um portal para outro mundo, um refúgio onde a realidade se mistura com a fantasia, onde os clientes se sentem como personagens de um filme. Assim como Amelie transformava a vida das pessoas ao seu redor, queremos que a East-Belle transforme o seu dia, trazendo mais leveza, alegria e sabor.</p>
                    <h4 className = "title2">Um Convite à Magia</h4>
                    <p className = "text">Seja para um café da manhã especial, um encontro com amigos ou um momento de solitude, a East-Belle está sempre de portas abertas para te receber e te transportar para um universo mágico, onde os sonhos se tornam realidade.</p>
                </div>
            </div>
            <div className = {styles.fundotxtEsq} style = {{backgroundColor: "#F9DBBD", justifySelf: "center", width: "auto"}}>
                <h1 className = "title">Venha viver essa experiência e se encantar com a magia da East-Belle!</h1>
            </div>
            <Rodape />
        </div>
    )
}