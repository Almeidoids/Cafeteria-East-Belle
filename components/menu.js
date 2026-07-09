"use client"

import Link from "next/link"
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

//Estilos
import "bootstrap-icons/font/bootstrap-icons.css";
import styles from "../style/menu.module.css"

//Fontes
import { candal } from "../public/fonts/fonts"

//Componentes
import Carrinho from "./carrinho";

// Util
import logged from "../util/authentication";

export default function Menu({ ref, style }) {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState("");

    useEffect(() => {
        async function verifyLogin() {
            const login = await logged(setIsLogged);

            if ("error" in login) return;

            else setUser(login.user);
            console.log(login);
        }

        verifyLogin();

    }, [])

    return (
        <nav className={`${styles.menu} ${candal.variable}`} ref={ref} style={style}>
            <div style={{ display: "flex", width: "100%" }}>
                <Link href="/" className={styles.Link}><button className={styles.button}>Inicio</button></Link>
                <Link href="/produtos/ofertas" className={styles.Link}><button className={styles.button}>Ofertas</button></Link>
                <Link href="/produtos" className={styles.Link}><button className={styles.button}>Todos produtos</button></Link>
                <Link href="/produtos/maisVendidos" className={`${styles.Link} ${styles.desaparecer}`}><button className={styles.button}>Mais vendidos</button></Link>
                <button className={`${styles.button} ${styles.desaparecer}`}>Cadastre-se</button>

                {!isLogged &&
                    <ButtonUserNotLogged />
                }
                {isLogged &&
                    <ButtonUserLogged user={user.name} type={user.type} />
                }

                <button
                    className={`${styles.buttonCarrinho} ${styles.desaparecer}`}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                >
                    <i className={`bi bi-cart4 ${styles.icone}`} />
                </button>
                <button
                    className={`${styles.buttonCarrinho} ${styles.menuCll}`}
                    data-bs-toggle="collapse"
                    href="#collapseMenu"
                    aria-expanded="false"
                    aria-controls="collapseMenu"
                >
                    <i className={`bi bi-list ${styles.icone}`} />
                </button>
                <Carrinho />
            </div>
            <div className="collapse" id="collapseMenu">
                <Link href="/produtos/maisVendidos" className={`${styles.Link}`}><button className={styles.button}>Mais vendidos</button></Link>
                <button className={`${styles.button}`}>Cadastre-se</button>
                <button className={`${styles.button}`}>Login</button>
                <button
                    className={`${styles.buttonCarrinho}`}
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasScrolling"
                    aria-controls="offcanvasScrolling"
                >
                    <i className={`bi bi-cart4 ${styles.icone}`} />
                </button>
            </div>
        </nav>
    )
}

function ButtonUserNotLogged({ }) {
    return (
        <div className={`${styles.Link} ${styles.desaparecer} dropdown`}>
            <button
                className={`${styles.button} dropdown-toggle`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Login
            </button>
            <div className="dropdown-menu" style={{ backgroundColor: "#2b061e" }}>
                <Link className={styles.dropdownLinks} href="/usuario/login"><button className={styles.button}>Como Usuário</button></Link>
                <Link className={styles.dropdownLinks} href="/comercial/login"><button className={styles.button}>Como Fornecedor</button></Link>
            </div>
        </div>
    )
}

function ButtonUserLogged({ user, type }) {
    const pathEdit = type === "client" ? "/usuario/editarConta" : "/comercial/fornecedor/editarConta";


    return (
        <div className={`${styles.Link} ${styles.desaparecer} dropdown`}>
            <button
                className={`${styles.button} dropdown-toggle`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{}}
            >
                Minha conta <i className={`bi bi-person-circle ${styles.icone}`} style={{ marginLeft: 10 }} />
            </button>
            <div className="dropdown-menu" style={{ backgroundColor: "#2b061e", width: "100%" }}>
                <h6 className={styles.titleUser}>{user}</h6>
                <Link className={styles.dropdownLinks} href={pathEdit}><button className={styles.button}>Editar conta</button></Link>
                <Link className={styles.dropdownLinks} href="/comercial/login"><button className={styles.button}>Meus pedidos</button></Link>
                <button className={styles.button} onClick={exitAccount} >Sair da conta</button>
            </div>
        </div>
    )
}

async function exitAccount() {
    const res = await fetch("/account/exit");

    if (res.ok && window !== undefined) {
        window.location.href = "/";
    }
}
