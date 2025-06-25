"use client"

import { useRef, useEffect } from "react";
import { candal, caveat } from "../../../../public/fonts/fonts";
import Image from "next/image";

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape"

//Estilos
import styles from "../../../../style/sobre.module.css";

export default function meioAmbiente() {
    const menu = useRef(null);
    
        useEffect(() => {
            menu.current.style.position = "fixed";
            menu.current.style.top = 0;
            menu.current.style.zIndex = 2;
        }, []);

    return (
        <div style = {candal.style}>
            <Menu ref = {menu} />
            <div className = {`${styles.organizacao}`}>
                <div className = {`${styles.fundotxtEsq} ${styles.sumidao} section-1`}>
                    <p className = {`${styles.paragrafo} text`} style = {caveat.style}>Na Cafeteria East-Belle, acreditamos que a sustentabilidade é fundamental para o futuro do nosso planeta. É por isso que estamos comprometidos em proteger o meio ambiente em todas as nossas operações.</p>
                    <h4 className = {`${styles.titulo} title2`}>Nossas Práticas Sustentáveis</h4>
                    <ul className = "list">
                        <li>Uso de Energia Renovável: Utilizamos energia solar para alimentar nossa cafeteria, reduzindo nossa pegada de carbono e economizando recursos naturais.</li>
                        <li>Reciclagem e Compostagem: Separamos e reciclamos todos os nossos resíduos, incluindo papel, plástico, vidro e alumínio. Também compostamos nossos resíduos orgânicos, como borra de café e restos de comida.</li>
                        <li>Uso de Produtos Sustentáveis: Servimos apenas produtos sustentáveis, como café orgânico, leite de origem animal e alimentos frescos e locais.</li>
                        <li>Educação Ambiental: Estamos comprometidos em educar nossos clientes sobre a importância da sustentabilidade. Oferecemos workshops e eventos sobre temas ambientais e incentivamos nossos clientes a adotarem práticas sustentáveis em suas vidas.</li>
                    </ul>
                    <h4 className = {`${styles.titulo} title2`}>Nosso Impacto</h4>
                    <p className = {`${styles.paragrafo} text`}>Estamos orgulhosos de ter um impacto positivo no meio ambiente. Desde que abrimos nossa cafeteria, reduzimos nossa pegada de carbono em mais de 50% e reciclamos mais de 90% de nossos resíduos.</p>
                </div>
                <div className = {`${styles.fundotxtPeq2} section-1`}>
                    <p className = {`${styles.paragrafo} text`} style = {caveat.style}>Na Cafeteria East-Belle, acreditamos que a sustentabilidade é fundamental para o futuro do nosso planeta. É por isso que estamos comprometidos em proteger o meio ambiente em todas as nossas operações.</p>
                </div>
                <div className = {`${styles.fundotxtPeq2}`}>
                    <h4 className = {`${styles.titulo} title2`}>Nossas Práticas Sustentáveis</h4>
                    <ul className = "list">
                        <li>Uso de Energia Renovável: Utilizamos energia solar para alimentar nossa cafeteria, reduzindo nossa pegada de carbono e economizando recursos naturais.</li>
                        <li>Reciclagem e Compostagem: Separamos e reciclamos todos os nossos resíduos, incluindo papel, plástico, vidro e alumínio. Também compostamos nossos resíduos orgânicos, como borra de café e restos de comida.</li>
                        <li>Uso de Produtos Sustentáveis: Servimos apenas produtos sustentáveis, como café orgânico, leite de origem animal e alimentos frescos e locais.</li>
                        <li>Educação Ambiental: Estamos comprometidos em educar nossos clientes sobre a importância da sustentabilidade. Oferecemos workshops e eventos sobre temas ambientais e incentivamos nossos clientes a adotarem práticas sustentáveis em suas vidas.</li>
                    </ul>
                </div>
                <div className = {`${styles.fundotxtPeq2}`}>
                    <h4 className = {`${styles.titulo} title2`}>Nosso Impacto</h4>
                    <p className = {`${styles.paragrafo} text`}>Estamos orgulhosos de ter um impacto positivo no meio ambiente. Desde que abrimos nossa cafeteria, reduzimos nossa pegada de carbono em mais de 50% e reciclamos mais de 90% de nossos resíduos.</p>
                </div>
                <Image 
                    src = "/images/sobre/meioAmbiente/cafeteria.jpg"
                    alt = "Uma das unidades da Cafeteria East-Belle"
                    width = {1000}
                    height = {1000}
                    className = {styles.imagem}
                />
                <Image 
                    src = "/images/sobre/meioAmbiente/floresta.jpg"
                    alt = "Imagem de uma arvore"
                    width = {1000}
                    height = {1000}
                    className = {styles.imagem}
                />
                <div className = {`${styles.fundotxtEsq} section-2`}>
                    <h4 className = {`${styles.titulo} title2`}>Como Você Pode Ajudar</h4>
                    <p className = {`${styles.paragrafo} text`}>Existem muitas maneiras de ajudar a proteger o meio ambiente. Aqui estão algumas dicas:</p>
                    <ul className = "list">
                        <li>Recicle e compostagem: Separe e recicle seus resíduos. Você também pode compostar seus resíduos orgânicos.</li>
                        <li>Use menos energia: Desligue as luzes e aparelhos quando não estiver usando. Você também pode usar lâmpadas de LED, que são mais eficientes em termos de energia.</li>
                        <li>Conserve água: Tome banhos mais curtos, conserte vazamentos e use menos água para regar seu jardim.</li>
                        <li>Compre produtos sustentáveis: Escolha produtos que sejam fabricados de forma sustentável e que tenham embalagens recicláveis.</li>
                        <li>Apoie empresas sustentáveis: Apoie empresas que estão comprometidas com a sustentabilidade.</li>
                    </ul>
                       <p className = {`${styles.paragrafo} text`}>Juntos, podemos fazer a diferença para o nosso planeta.</p>
                </div>
                
            </div>
            <Rodape style = {{ScrollSnapAlign: "center"}} />
        </div>
    )
}