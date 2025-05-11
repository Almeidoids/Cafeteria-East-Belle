"use client"

import Script from 'next/script';
import { useState } from 'react';1
import { usePathname } from 'next/navigation';

//Estilos
import '../../style/global.css';
import "../../style/sobreGlobal.css";

//Fontes
import { candal, caveat } from '../../public/fonts/fonts';

//Componentes
import ModalConfirm from '../../components/modalConfirm';

//Constants
import { Cart } from '../../constants/carrinho';


export default function RootLayout({ children }) {
  const [cart, setCart] = useState([]);
  const path = usePathname();

  return (
    <html lang="pt-br" className = {`${caveat.variable} ${path.startsWith("/sobre") ? "tela" : null}`}>
      <head>
        <title>Cafeteria East-Belle</title>
        <link rel="icon" href="/images/icones/favicon.ico" sizes="any" />
      </head>
      <body className = {path.startsWith("/sobre") ? "corpo" : null}>
        <Cart.Provider value = {{cart, setCart}}>
          {children}
          <ModalConfirm />
        </Cart.Provider>
        <Script src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" strategy = "afterInteractive"/>
      </body>
    </html>
  );
}
