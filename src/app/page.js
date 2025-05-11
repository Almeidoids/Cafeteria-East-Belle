"use client"

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

//estilos
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../../style/page.module.css"

//fontes
import { candal } from "../../public/fonts/fonts";

//Componentes
import Menu from "../../components/menu";
import CardIndex from "../../components/cardIndex";
import Rodape from "../../components/rodape";
import Receitas from "../../components/receitas";

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
        <Receitas style = {{display: "block"}} close = {() => changeLink("/")} i = {index} />
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