"use client"

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

//estilos
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../../style/page.module.css"

//fontes
import { candal, caveat } from "../../public/fonts/fonts";

//Componentes
import Menu from "../../components/menu";
import CardIndex from "../../components/cardIndex";
import Rodape from "../../components/rodape";
import Modal from "../../components/modal";

//Constantes
import receitas from "../../constants/receitas";
import produtos from "../../constants/produtos";
import CardItens from "../../components/cardItens";
import Carrossel from "../../components/carrossel";

export default function Index() {

  const refMenu = useRef(0);
  const refImage = useRef(0);
  const location = usePathname();
  const [index, setIndex] = useState(0);
  const selledList = produtos.toSorted((a, b) => b.buyed - a.buyed);
  const [moreSelled, setMoreSelled] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          refMenu.current.style.position = "static";
          refMenu.current.style.top = 0;          
        }
      },
    {root: null, threshold: 0.0}
    )

    function roll() {
      const menuRect = refMenu.current.getBoundingClientRect();
      const isAtTop = menuRect.top <= 0;
      
      if (isAtTop) {
        refMenu.current.style.position = "fixed";
        refMenu.current.style.top = 0;
        refMenu.current.style.zIndex = 10;
      }
      else {
        observer.observe(refImage.current);
      };
    }
    
    window.addEventListener("scroll", roll);

    return () => {
      window.removeEventListener("scroll", roll)

      observer.disconnect
    }
  }, []);

  useEffect(() => {
    setMoreSelled(selledList.map(item => {
      if(selledList.indexOf(item) < 12) {
      return (
          <CardItens
            key = {item.key}
            offer = {item.offer}
            image = {item.image}
            title = {item.name}
            original = {item.originalp}
            link = {`/produtos/${item.key}`}
          />
      )};
    }))
  }, []);

  const revenue = receitas.map(item => {
    return (
      <CardIndex
          key = {receitas.indexOf(item)}
          name = {item.name}
          image = {item.image}
          description = {item.description}
          onClick = {() => changeLink(`/item${receitas.indexOf(item)}`, setIndex)}
      />
    );
  })

  const offers = produtos.map(item => {
    if(item.key <= 12 && item.offer !== 0) {
      return (
          <CardItens
            key = {item.key}
            offer = {item.offer}
            image = {item.image}
            title = {item.name}
            original = {item.originalp}
            link = {`/produtos/${item.key}`}
          />
      )
    };
  })

  const ingredients = receitas[index].ingredients.map(item => { 
    let num = receitas[index].ingredients.indexOf(item);
    return <li key = {num}>{item}</li>
  })

  const hints = receitas[index].hints.map(item => { 
    let num = receitas[index].hints.indexOf(item);
    return <li key = {num}>{item}</li>
  })

  return (
    <div style = {candal.style}>
      <div className = "fundoBanner">
        <Image
          src = "/banner/banner.jpg"
          alt = "Banner Café"
          priority
          className = {styles.banner}
          ref = {refImage}
          width = {1000}
          height = {1000}
        />
      </div>
      <Menu ref = {refMenu}/>
      <h1 className = {styles.titulos}>Receitas</h1>
      <div className = {styles.receitas}>
        {revenue}
      </div>

      {location !== `/` &&
        <Modal style = {{display: "block"}} close = {() => changeLink("/")} i = {index} >
          <h1 className = {styles.titleRevenue}>{receitas[index].name}</h1>
          <div className = {styles.algnRevenue}>
            
            <div className = {styles.conteudo}>
              <ol className = {styles.listaol}>
                
                <div>
                  <li>Ingredientes</li>
                  <ul>
                    {ingredients}
                  </ul>
                </div>

                <div>
                  <li>Preparo</li>
                  <ol className = {styles.subol} style = {caveat.style}>
                    {receitas[index].preparation}
                  </ol>
                </div>

                <div className = {styles.alnnFinalRevenue}>
                  <li>Dicas</li>
                  <ul style = {caveat.style} >
                    {hints}
                  </ul>
                </div>

              </ol>
            </div>

            <div className = {styles.divImagens}>
              
              <div>
               <Image 
                  src = {receitas[index].image0}
                  alt = {`Ingredientes do ${receitas[index].name}`}
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>

              <div>
               <Image 
                  src = {receitas[index].image1}
                  alt = {`Preparo do ${receitas[index].name}`}
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>

              <div>
               <Image 
                  src = {receitas[index].image2}
                  alt = {`Dicas para melhorar seu ${receitas[index].name}`}
                  height = {400}
                  width = {400}
                  className = {styles.imagens}
                />
              </div>

            </div>

          </div>
        </Modal>
      } 

      <h4 style = {{color: "#2b061e !important"}}>Ofertas: </h4>
      <Carrossel>
          {offers}
      </Carrossel>
      <h4 style = {{color: "#2b061e !important"}}>Mais Vendidos: </h4>
      <Carrossel>
        {moreSelled}
      </Carrossel>
      <Rodape />
    </div>  
  );
}

export function changeLink(url, setIndex) {
  const arrayurl = url.slice("");
  url !== "/" ?
  setIndex(Number(arrayurl[arrayurl.length -1 ])) : arrayurl;

  if (typeof window === "undefined") {
    return;
  }
  else {
    window.history.pushState(null, "", url);
  }
}