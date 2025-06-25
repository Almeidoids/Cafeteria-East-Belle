"use client"

import Link from "next/link"
import { useState } from "react";

//Estilos
import styles from "../style/menu.module.css"
import "bootstrap-icons/font/bootstrap-icons.css";

//Fontes
import { candal } from "../public/fonts/fonts"

//Componentes
import Carrinho from "./carrinho";

export default function Menu({ref, style}) {
    return(
      <nav className = {`${styles.menu} ${candal.variable}`} ref = {ref} style = {style}>
        <div style = {{display: "flex", width: "100%"}}>
          <Link href = "/" className = {styles.Link}><button className = {styles.button}>Inicio</button></Link>
          <Link href = "/produtos/ofertas" className = {styles.Link}><button className = {styles.button}>Ofertas</button></Link>
          <Link href = "/produtos" className = {styles.Link}><button className = {styles.button}>Todos produtos</button></Link>
          <Link href = "/produtos/maisVendidos" className = {`${styles.Link} ${styles.desaparecer}`}><button className = {styles.button}>Mais vendidos</button></Link>
          <button className = {`${styles.button} ${styles.desaparecer}`}>Cadastre-se</button>
          <button className = {`${styles.button} ${styles.desaparecer}`}>Login</button>
          <button 
            className = {`${styles.buttonCarrinho} ${styles.desaparecer}`} 
            data-bs-toggle = "offcanvas" 
            data-bs-target = "#offcanvasScrolling" 
            aria-controls = "offcanvasScrolling"
            >
            <i className = {`bi bi-cart4 ${styles.icone}`} />
          </button>
          <button 
            className = {`${styles.buttonCarrinho} ${styles.menuCll}`} 
            data-bs-toggle = "collapse" 
            href="#collapseMenu"
            aria-expanded = "false"
            aria-controls="collapseMenu"
            >
            <i className = {`bi bi-list ${styles.icone}`} />
          </button>
          <Carrinho />
        </div>
          <div className="collapse" id="collapseMenu">
            <Link href = "/produtos/maisVendidos" className = {`${styles.Link}`}><button className = {styles.button}>Mais vendidos</button></Link>
            <button className = {`${styles.button}`}>Cadastre-se</button>
            <button className = {`${styles.button}`}>Login</button>
            <button 
              className = {`${styles.buttonCarrinho}`} 
              data-bs-toggle = "offcanvas" 
              data-bs-target = "#offcanvasScrolling" 
              aria-controls = "offcanvasScrolling"
              >
              <i className = {`bi bi-cart4 ${styles.icone}`} />
            </button>
            </div>
      </nav>
    )
}