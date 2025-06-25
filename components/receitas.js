"use client"

import Image from "next/image";
import { usePathname } from "next/navigation";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/receitas.module.css"

//Fontes
import { caveat } from "../public/fonts/fonts";

//Constantes
import receitas from "../constants/receitas";

export default function Receitas({style, close, i}) {
  const url = usePathname();

  const ingredients = receitas[Number(i)].ingredients.map(item => { 
      let num = receitas[Number(i)].ingredients.indexOf(item);
      return <li key = {num}>{item}</li>
    })

  const hints = receitas[Number(i)].hints.map(item => { 
    console.log(i);
    let num = receitas[Number(i)].hints.indexOf(item);
    return <li key = {num}>{item}</li>
  })

    return (
        <div className = {`card ${styles.corpo}`} style = {style}>
          <div style = {{display: "flex"}}>
              <button 
                  type = "button" 
                  className = "btn-close" 
                  aria-label = "close"
                  style = {{marginLeft: "auto"}}
                  onClick = {close}    
              />
          </div>
          <h1 style = {{textAlign: "center", marginBottom: 20}}>{receitas[Number(i)].name}</h1>
          <div style = {{display: "flex"}}>
            <div className = {styles.conteudo}>
                <ol className = {styles.listaol}>
                  <div>
                    <li>Ingredientes</li>
                    <ul className = {styles.ul} style = {caveat.style}>
                      {ingredients} 
                    </ul>
                  </div>
                  <div>
                    <li>Preparo</li>
                    <ol className = {styles.subol} style = {caveat.style}>
                      {receitas[Number(i)].preparation}
                    </ol>
                  </div>
                  <div style = {{marginBottom: "10%"}}>
                  <li>Dicas</li>
                    <ul className = {styles.ul} style = {caveat.style}>
                      {hints}
                    </ul>
                  </div>
                </ol>
            </div>
            <div className = {styles.divImagens}>
              <div>
                <Image 
                  src = {receitas[Number(i)].image0}
                  alt = "Ingredientes Café Etiope"
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>
              <div>
                <Image 
                  src = {receitas[Number(i)].image1}
                  alt = "Preparo do Café Etiope"
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>
              <div>
                <Image 
                  src = {receitas[Number(i)].image2}
                  alt = "Mulher muito sorridente aproveitando de seu cafe"
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>
            </div>
          </div>
      </div>
    )
}