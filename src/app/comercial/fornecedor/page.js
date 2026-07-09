"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

//estilos
import styles from "../../../../style/fornecedor.module.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//fontes
import { candal } from "../../../../public/fonts/fonts"

// Componentes
import Authenticated from "../../../../components/authenticated";
import TableProducts from "../../../../components/tableProducts";
import BackBtn from "../../../../components/backBtn";
import Dropdown from "../../../../components/dropdown";

// Util
import { verifyLogin } from "../../../../util/authentication";

// Constants
// import produtos from "../../../../constants/produtos";

export default function Fornecedor({ }) {
    const refBorder1 = useRef(null);
    const refBorder2 = useRef(null);
    const refBorder3 = useRef(null);
    const refAppear = useRef(null);
    const refDisappear = useRef(null);
    const [supplier, setSupplier] = useState(null);
    const [isLogged, setIsLogged] = useState(true);
    const [reqError, setReqError] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        function animation() {
            refBorder1.current.remove();
            refBorder2.current.remove();
            refBorder3.current.remove();

            refBorder1.current.removeEventListener("animationend", animation);
        }

        refBorder1.current.addEventListener("animationend", animation)
    }, []);

    useEffect(() => {
        async function getSupplier() {
            let fornecedor = "";

            try {
                fornecedor = await verifyLogin(setIsLogged);
            }
            catch (err) {
                setReqError(login.error);
                setTimeout(() => redirect(`/comercial/cadastro`), 1000 * 2);
            }

            const res = await fetch(`/comercial/fornecedor/get/${fornecedor}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) {
                setIsLogged(false);
                const result = await res.json();
                setReqError(result.error);

                setTimeout(() => redirect("/comercial/cadastro"), 1000 * 10);
            }

            const { data } = await res.json();

            setSupplier(data.name);
            setProducts(data.products);
        }

        getSupplier();
    }, []);

    return (
        <div className={`${styles.tutorial} ${candal.variable}`}>
            <div className={styles.algnHeader}>
                <Link href="/" ><BackBtn /></Link>
                <div style={{ display: "flex" }}>
                    <button className={styles.headerTxt} onClick={() => disappear(refDisappear.current, refAppear.current)}>?</button>

                    <Dropdown text="Conta" >
                        <li className={`${styles.dropdownItem}`}>
                            <Link className={styles.linkEdit} href={`/comercial/fornecedor/editarConta`}>Editar conta</Link>
                        </li>

                        <li className={`${styles.dropdownItem} ${styles.exitButton} `} onClick={() => exitSession()} >
                            <i className={`bi bi-box-arrow-left ${styles.iconBtn}`} />
                            Sair da conta
                        </li>
                    </Dropdown>
                </div>
            </div>

            <div className={styles.algnBody}>

                {!isLogged &&
                    <Authenticated text={`${reqError}. Redirecionando`} img={"/images/icones/cup.png"} color={"#F9DBBD"} />
                }

                {isLogged &&
                    <div>
                        <div style={{ display: "none" }} ref={refDisappear}>
                            <h1 className={styles.title}>Bem vindo, {supplier}</h1>
                            <h6 className={styles.subtitle}>Nesta página, você verá como pode organizar seus produtos, desde criá-los, até a organizá-los e tirá-los de estoque. Abaixo está uma lista de operações essenciais</h6>
                            <ul className={styles.ultutorial}>
                                <li>Adicionar produtos: Para adicionar produtos, basta clicar no botão {'"adicionar"'} e, preencher o formulário com as informações do seu produto.</li>
                                <li>Remover Produtos: Ao passar o mouse acima do produto, basta clicar no botão com o ícone de lixeira, confirmar a remoção (tenha certeza de que quer realmente remover o produto), e pronto! Caso queira remover todos os produtos, basta clicar em {"remover todos"}.</li>
                                <li>Editar Produtos: Para editar os produtos, basta clicar no ícone de lápis e, preencher o formuário com as informações que você deseja alterar.</li>
                            </ul>
                            <div className={styles.algnBtnTutorial}>
                                <button className={styles.btnTutorial} onClick={() => disappear(refAppear.current, refDisappear.current)}>Entendido</button>
                            </div>
                        </div>

                        <div className={styles.appear} ref={refAppear}>
                            {supplier === null &&
                                <div className={styles.loading} />
                            }
                            {supplier &&
                                <>
                                    <div style={{ display: products[0] ? "none" : "block" }} >
                                        <h1 className={styles.title}>Comece criando um produto:</h1>
                                        <div className={styles.algnBtnTutorial}>
                                            <Link href={`/comercial/fornecedor/produto/0`}><button className={styles.btnTutorial} style={{ marginTop: 30 }}>Criar</button></Link>
                                        </div>
                                    </div>
                                    <div style={{ display: !products[0] ? "none" : "block" }}>
                                        <TableProducts products={products} setProducts={setProducts} />
                                    </div>
                                </>
                            }
                        </div>


                        <div className={styles.border1} ref={refBorder1} />
                        <div className={styles.border2} ref={refBorder2} />
                        <div className={styles.border3} ref={refBorder3} />
                    </div>
                }
            </div>
        </div>
    )
}

function disappear(toAppear, toDisappear) {
    toDisappear.className = styles.disappear;

    setTimeout(() => {
        toDisappear.style.display = "none";
        toAppear.style.display = "block";
        toAppear.className = styles.appear;
    }, 500)
}


async function exitSession() {
    const res = await fetch("/account/exit");

    if (res.ok) {
        redirect("/");
    }
}
