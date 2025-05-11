"use client"

import { useRef } from "react";

//Estilos
import styles from "../style/carrossel.module.css"

export default function Carrossel({children}) {
    const refCarousel = useRef();

    return (
        <div className = {styles.organizacaoCarrossel} >
            <button className = {styles.botaoCarrossel} onClick = {() => {
                carouselAnimation(refCarousel.current, -(refCarousel.current.clientWidth / 24));
            }}>{"<"}</button>
            <div className = {styles.carrossel} ref = {refCarousel} data-testid = "testeCarrossel">
                {children}
            </div>
            <button className = {styles.botaoCarrossel} onClick = {() => {
              carousel.carouselAnimation(refCarousel.current, (refCarousel.current.clientWidth / 24));       
            }}>{">"}</button>
        </div>
    )
}

function carouselAnimation(carousel, fps) {
  if (typeof window === "undefined") {
    return;
  }
  else {
    let scroll = carousel.scrollLeft;
    const limit = Math.sign(fps) === -1 ? scroll - (carousel.clientWidth) : scroll + (carousel.clientWidth);
    Math.sign(fps) === -1 ? animationLeft() : animationRight();

    function animationRight() {
      if (scroll < limit) {
        scroll = scroll + fps;
        carousel.scrollTo(scroll, 0);
        requestAnimationFrame(animationRight);
      }
    }
    function animationLeft() {
      if (scroll > limit) {
        scroll = scroll + fps;
        carousel.scrollTo(scroll, 0);
        requestAnimationFrame(animationLeft);
      }
    }
  }
}

export const carousel = {carouselAnimation}; //Exportação para testes