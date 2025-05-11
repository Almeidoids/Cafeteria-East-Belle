"use client"

import { useEffect, useRef } from "react";
import Image from "next/image";

//Componentes
import Menu from "../../../components/menu"
import Rodape from "../../../components/rodape"

//Estilos
import styles from "../../../style/sobre.module.css";

//Fontes
import { candal } from "../../../public/fonts/fonts";

export default function Sobre() {
    const menu = useRef(null);
    
    useEffect(() => {
        menu.current.style.position = "fixed";
        menu.current.style.top = 0;
        menu.current.style.zIndex = 2;
    }, []);

    return(
        <div style = {candal.style}>
            <Menu ref = {menu} />
            <div className = {styles.organizacao}>
                <div className = {`${styles.fundotxtEsq} ${styles.sumidao}`} style = {{width: "70%"}}>
                    <h4 className = "title2">Cafeteria East-Belle</h4>
                    <p className = "text">Bem-vindo à Cafeteria East-Belle, um lugar onde o charme vintage encontra o conforto moderno. Localizada no coração da cidade, nossa cafeteria é um refúgio acolhedor para aqueles que buscam uma pausa na agitação do dia a dia.</p>
                    <h4 className = "title2">Ambiente Único</h4>
                    <p className = "text">Um lugar onde o charme do passado encontra o conforto do presente. Nosso espaço é decorado com paredes de tijolos aparentes e móveis de madeira, criando um ambiente nostálgico e aconchegante. A iluminação suave e a música tranquila completam o clima perfeito para relaxar e desfrutar de bons momentos.</p>
                </div>
                <div className = {styles.fundotxtPeq}>
                    <h4 className = "title2">Cafeteria East-Belle</h4>
                    <p className = "text">Bem-vindo à Cafeteria East-Belle, um lugar onde o charme vintage encontra o conforto moderno. Localizada no coração da cidade, nossa cafeteria é um refúgio acolhedor para aqueles que buscam uma pausa na agitação do dia a dia.</p>
                    <h4 className = "title2">Ambiente Único</h4>
                    <p className = "text">Um lugar onde o charme do passado encontra o conforto do presente. Nosso espaço é decorado com paredes de tijolos aparentes e móveis de madeira, criando um ambiente nostálgico e aconchegante. A iluminação suave e a música tranquila completam o clima perfeito para relaxar e desfrutar de bons momentos.</p>
                </div>
                <Image 
                    src = "/images/sobre/cafeteriaEastBelle.jpg"
                    alt = "Uma das unidades da Cafeteria East-Belle"
                    width = {1000}
                    height = {1000}
                    className = {styles.imagem}
                    style = {{display: "block"}}
                />
                <div className = {styles.fundotxtEsq}>
                    <h4 className = "title2">Nossa Equipe</h4>
                    <p className = "text">Recepção calorosa e atendimento personalizado. Nossa equipe é dedicada a proporcionar uma experiência memorável, desde a escolha do grão perfeito até o sorriso ao servir o seu café.</p>
                    <h4 className = "title2">Nossas Bebidas</h4>
                    <p className = "text">Café é a nossa paixão! Oferecemos uma seleção de grãos artesanais, torrados com maestria para realçar os sabores mais ricos. Seja um expresso clássico ou um latte art sofisticado, cada xícara é preparada com carinho e atenção. Além do café, temos chás gourmet, sucos naturais e smoothies refrescantes.</p>
                    <h4 className = "title2">Eventos e Comunidade</h4>
                    <p className = "text">Mais do que uma cafeteria, somos um espaço para a comunidade. Organizamos noites de poesia, apresentações musicais ao vivo e workshops de arte, criando um ambiente inspirador onde todos são bem-vindos.</p>
                    <h4 className = "title2">Nossa Missão</h4>
                    <p className = "text">Proporcionar um espaço perfeito para reunir amigos, trabalhar ou simplesmente relaxar com uma boa xícara de café. Venha nos visitar e descubra por que a Cafeteria East-Belle é tão especial.</p>
                </div>
            </div>
            <Rodape />
        </div>
    )
}

