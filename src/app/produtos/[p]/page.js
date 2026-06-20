"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape"
import Formulario from "../../../../components/formulario";

//Fontes
import { candal, caveat } from "../../../../public/fonts/fonts"

//Estilos
import styles from "../../../../style/p.module.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Util
import { getImage } from "../../../../util/CreateOrChangeImage";
import createRefList from "../../../../util/createRefList";

export default function P({ params }) {
    // {offer, price, name, description, images, quantity, id}

    const [product, setProduct] = useState(null);
    const [image, setImage] = useState(null);
    const liRefImg = useRef([]);
    const subtract = () => ((Number(product.price) * Number(product.offer)) / 100).toFixed(2);

    useEffect(() => {
        async function getProduct() {
            const { p } = await params;

            const res = await fetch(`/products/${p}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                console.log("Erro");
            }

            else {
                const result = await res.json();
                console.log(result)
                const productData = result.product;

                setProduct(productData);
                setImage(getImage(productData.images[0]).image);
            }
        }

        getProduct();

    }, [])

    useEffect(() => {
        if (product) {
            createRefList(product.images.length, liRefImg.current);
            console.log(product);
        };
    }, [product]);

    return (
        <div style={candal.style} className={caveat.variable}>
            <Menu style={{ position: "fixed", top: 0 }} />
            {product &&

                <div className={styles.alinhamento}>
                    <div className={styles.alinhamentoProduto}>
                        <h1 className={styles.titulo}>{product.name}</h1>
                        {product.offer !== 0 &&
                            <h5 style={{ fontSize: 14, color: "#604456" }} className={styles.titulo}>Com {product.offer}% de desconto</h5>
                        }
                        <div style={{ marginTop: "5%" }}>
                            <p className={styles.texto}>{product.description}</p>
                        </div>
                        <div className={styles.txtcompra}>
                            {product.offer !== 0 &&
                                <p className={styles.oferta}>{product.price}</p>
                            }
                            <p className={styles.preco}>{(Number(product.price) - subtract()).toFixed(2)}</p>
                            <Formulario product={product} />
                        </div>
                    </div>

                    <div className={styles.alngImg}>
                        <Image
                            src={image}
                            alt={product.name}
                            height={400}
                            width={400}
                            className={styles.imagem}
                        />

                        <div className = {styles.algnImgOptions}>
                            {product.images.map((item, i) => {
                                const actualImg = getImage(item).image;
                                return(
                                    <Image
                                        key={i}
                                        src={actualImg}
                                        alt={`${i} item da lista de imagens do produto`}
                                        width = {100}
                                        height = {100}
                                        onClick={() => {
                                            setImage(actualImg);

                                            for (let j = 0; j < liRefImg.current.length; j++) {
                                                if (j == i) {
                                                    liRefImg.current[j].style.filter = "";
                                                }

                                                else {
                                                    liRefImg.current[j].style.filter = "contrast(70%)";
                                                }
                                            }
                                        }}
                                        style = {{filter: i == 0 ? "" : "contrast(70%)"}}
                                        className = {styles.optionImg}
                                        ref = {(e) => liRefImg.current[i] = e}
                                    />
                                )
                            })}
                        </div>

                    </div>
                </div>
            }
            <Rodape className={styles.footerR} />
        </div>
    )
}