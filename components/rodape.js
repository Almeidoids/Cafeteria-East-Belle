import styles from "../style/rodape.module.css";
import Link from "next/link";
import { candal } from "../public/fonts/fonts";

export default function Rodape({style, className}) {
    return(
        <footer className = {`${styles.footer} ${candal.variable} ${className}`} style = {style}>
            <div className = {styles.column}>
                <h4 className = {styles.h4}>Sobre nós</h4>
                <Link href = "/sobre"><p className = {styles.textoFooter}>Nossa Cafeteria</p></Link>
                <Link href = "/sobre/inspiracao"><p className = {styles.textoFooter}>Nossa Inspiração</p></Link>
                <Link href = "/sobre/meioAmbiente"><p className = {styles.textoFooter}>Meio-Ambiente</p></Link>
                <p className = {styles.textoFooter}>Contate-nos</p>
            </div>

            <div className = {styles.column}>
                <h4 className = {styles.h4}>Produtos</h4>
                <p className = {styles.textoFooter}>Cadastrar produtos</p>
                <p className = {styles.textoFooter}>Alterar Produtos</p>
                <p className = {styles.textoFooter}>Visualizar Produtos</p>
            </div>

            <div className = {styles.column}>
                <h4 className = {styles.h4}>Usuarios</h4>
                <p className = {styles.textoFooter}>Cadastre-se</p>
                <p className = {styles.textoFooter}>Login</p>
                <p className = {styles.textoFooter}>Carrinho</p>
            </div>
        </footer>
    )
}