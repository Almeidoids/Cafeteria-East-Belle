"use client";

import { useEffect, useState } from "react";

// Fontes
import { candal } from "../../../public/fonts/fonts";

//Componentes
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";
import CardItens from "../../../components/cardItens";

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../../style/produtos.module.css"

// UTIL
import { getImage } from "../../../util/CreateOrChangeImage";
import logged from "../../../util/authentication";

export default function Produtos() {

    const [lista, setLista] = useState([]);
    const [supplier, setSupplier] = useState();
    const [isLogged, setIsLogged] = useState(true);

    useEffect(() => {
        async function verifyLogin() {
            const login = await logged(setIsLogged);

            if (!("error" in login) && login.type === "supplier") {
                const supplierId = await getSupplier(login);
                
                getProducts(supplierId);
            }
        }

        async function getSupplier(login) {
            const res = await fetch(`/account/supplier/${login.name}`);

            if (!res.ok) {
                const result = await res.json();
                console.log(`Erro: ${result.err}`);
            }

            else {
                const result = await res.json();
                return result.id;
            }
        }

        async function getProducts(id) {
            const res = await fetch("/products", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                return
            }

            else {
                const result = await res.json();

                const products = result.products.map((item) => {
                    const { image } = getImage(item.image);
                    const isMine = (id && id === item.supplierId);
                    console.log(isMine);
                    console.log(id);
                    item.image = image;

                    return (
                        <CardItens
                            key={item.key}
                            offer={item.offer}
                            image={item.image}
                            title={item.name}
                            price={Number(item.price)}
                            link={isMine ? `/comercial/fornecedor/produto/${item.key}` : `/produtos/${item.key}`}
                            edit={isMine ? true : false}
                        />
                    )
                })

                setLista(products);
            }
        }

        verifyLogin();
    }, [])

    useEffect(() => {
        async function getProducts() {
            const res = await fetch("/products", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                return
            }

            else {
                const result = await res.json();

                const products = result.products.map((item) => {
                    const { image } = getImage(item.image);
                    const isMine = (supplier && supplier === item.supplierId);
                    item.image = image;

                    return (
                        <CardItens
                            key={item.key}
                            offer={item.offer}
                            image={item.image}
                            title={item.name}
                            price={Number(item.price)}
                            link={isMine ? `/comercial/fornecedor/produto/${item.key}` : `/produtos/${item.key}`}
                            edit={isMine ? true : false}
                        />
                    )
                })

                setLista(products);
            }
        }

        getProducts();
    }, []);

    return (
        <div style={candal.style}>
            <Menu style={{ position: "fixed", zIndex: 2 }} />
            <div className={styles.algn}>
                <div className={styles.organizacaoProdutos}>
                    {lista}
                </div>
            </div>
            <Rodape style={{ marginTop: "5%" }} />
        </div>
    )
}
