import styles from "../style/rodape.module.css";
import Link from "next/link";
import { candal } from "../public/fonts/fonts";

export default function Rodape({style, className}) {
    return(
        <footer className = {`${styles.footer} ${candal.variable} ${className}`} style = {style}>
            <div className = {styles.column}>
                <h4 className = {styles.h4}>Sobre nós</h4>
                <Link href = "/sobre" className = {styles.lnktxt}><p className = {styles.textoFooter}>Nossa Cafeteria</p></Link>
                <Link href = "/sobre/inspiracao" className = {styles.lnktxt}><p className = {styles.textoFooter}>Nossa Inspiração</p></Link>
                <Link href = "/sobre/meioAmbiente" className = {styles.lnktxt}><p className = {styles.textoFooter}>Meio-Ambiente</p></Link>
                <Link href = "/sobre/contato" className = {styles.lnktxt}><p className = {styles.textoFooter}>Contate-nos</p></Link>
            </div>

            <div className = {styles.column}>
                <h4 className = {styles.h4}>Fornecedores</h4>
                <Link href = "/comercial/cadastro" className = {styles.lnktxt}><p className = {styles.textoFooter}>Cadastre-se</p></Link>
                <Link href = "/comercial/login" className = {styles.lnktxt}><p className = {styles.textoFooter}>Entrar</p></Link>
            </div>

            <div className = {styles.column}>
                <h4 className = {styles.h4}>Usuarios</h4>
                <Link href = "/usuario/cadastro" className = {styles.lnktxt}><p className = {styles.textoFooter}>Cadastre-se</p></Link>
                <Link href = "/usuario/login" className = {styles.lnktxt}><p className = {styles.textoFooter}>Entrar</p></Link>
            </div>
        </footer>
    )
}