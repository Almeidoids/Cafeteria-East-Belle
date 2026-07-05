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
import logged from "../../../../util/authentication";

export default function Cadastro() {
    const refCnpj = useRef(null);
    const [cnpj, setCnpj] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        async function verifyLogin() {
            const login = await logged(setIsLogged);

            if ("error" in login) return;

            else setTimeout(() => redirect(`/comercial/fornecedor/`), 1000 * 10);
        }

        verifyLogin();

    }, [])

    useEffect(() => {
        const actualCnpj = refCnpj.current.value;
        let updateCnpj = actualCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            function (regex, arg1, arg2, arg3, arg4, arg5) {
                return arg1 + "." + arg2 + "." + arg3 + "/" + arg4 + "-" + arg5;
            }

        );

        refCnpj.current.value = updateCnpj;
    }, [cnpj]);

    return (
        <div className={candal.variable}>
            <Menu style={{ position: "fixed", top: 0 }} />
            {isLogged &&
                <Authenticated 
                    text = {"Sua sessão já existe. Redirecionando"} 
                    color = {"#2B061E"}
                />
            }
            {!isLogged &&

                <form className={styles.form} onSubmit={(e) => login(e, setAlert)}>
                    <label className={styles.lbl} htmlFor="cnpj">CNPJ</label>
                    <input
                        required
                        className={`${styles.input} ${styles.cnpj}`}
                        type="text"
                        name="cnpj"
                        pattern="\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"
                        maxLength={18}
                        ref={refCnpj}
                        onChange={(e) => setCnpj(e.currentTarget.value)}
                    />
                    <label className={styles.lbl} htmlFor="password">Senha</label>
                    <input required className={styles.input} type="password" name="password" />

                    <Link href = "/comercial/cadastro" className = {styles.link}>Não tem uma conta? Faça seu cadastro</Link>

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
        identifier: e.target.cnpj.value,
        password: e.target.password.value,
        type: "supplier"
    }

    const res = await fetch("/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        setAlert(error.error)
    }
    else {
        const result = await res.json();
        // const name = result.supplier;
        console.log(result);
        redirect(`/comercial/fornecedor`)
    }
}