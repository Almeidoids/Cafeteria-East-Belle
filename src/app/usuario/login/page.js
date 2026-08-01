"use client";

import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape"
import Alert from "../../../../components/alert";
import Authenticated from "../../../../components/authenticated";

//estilos
import styles from "../../../../style/cadastro.module.css"

//Fontes
import { candal } from "../../../../public/fonts/fonts"

// UTIL
import { verifyLogin } from "../../../../util/authentication";

export default function Cadastro() {
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        verifyLogin()
            .then(() => {
                setTimeout(() => redirect("/"), 1000 * 2);
                setIsLogged(true);
            })
            .catch(() => setIsLogged(false));
    }, [])

    return (
        <div className={candal.variable}>
            <Menu style={{ position: "fixed", top: 0 }} />
            {isLogged &&
                <Authenticated
                    text={"Sua sessão já existe. Redirecionando"}
                    color={"#2B061E"}
                />
            }
            {!isLogged &&

                <form className={styles.form} onSubmit={(e) => login(e, setAlert)}>
                    <label className={styles.lbl} htmlFor="email">E-mail</label>
                    <input
                        required
                        className={`${styles.input} ${styles.cnpj}`}
                        type="email"
                        name="email"
                    />
                    <label className={styles.lbl} htmlFor="password">Senha</label>
                    <input required className={styles.input} type="password" name="password" />

                    <Link href="/usuario/cadastro" className={styles.link}>Não tem uma conta? Faça seu cadastro</Link>

                    <div className={styles.btnalgn}>
                        <input type="reset" className={styles.btnReset} />
                        <button type="submit" className={styles.btnSubmit}>Entrar</button>
                    </div>
                </form>
            }
            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}

async function login(e, setAlert) {
    e.preventDefault();

    const data = {
        identifier: e.target.email.value,
        password: e.target.password.value,
        type: "client",
    }

    const res = await fetch("/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        setAlert(error.err)
    }

    else {
        redirect(`/`);
    }
}
