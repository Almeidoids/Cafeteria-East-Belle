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

// Util
import logged from "../../../../util/authentication";

export default function Cadastro() {
    const refCpf = useRef(null);
    const [cpf, setCpf] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const actualCpf = refCpf.current.value;
        let updateCpf = actualCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,
            function (regex, arg1, arg2, arg3, arg4, arg5) {
                return arg1 + "." + arg2 + "." + arg3 + "-" + arg4;
            }
        );

        refCpf.current.value = updateCpf;
    }, [cpf]);

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
                <form className={styles.form} onSubmit={(e) => cadastro(e, setAlert)}>
                    <label className={styles.lbl} htmlFor="name">Nome completo</label>
                    <input required className={styles.input} type="text" name="name" />
                    <label className={styles.lbl} htmlFor="email">Email</label>
                    <input required className={styles.input} type="email" name="email" />
                    <label className={styles.lbl} htmlFor="cpf">CPF</label>
                    <input
                        required
                        className={`${styles.input} ${styles.cnpj}`}
                        type="text"
                        name="cpf"
                        pattern="\d{3}\.\d{3}\.\d{3}\-\d{2}"
                        maxLength={14}
                        ref={refCpf}
                        onChange={(e) => setCpf(e.currentTarget.value)}
                    />
                    <label className={styles.lbl} htmlFor="address">Informe seu endereço</label>
                    <input required className={styles.input} type="text" name="address" />
                    <label className={styles.lbl} htmlFor="password">Senha</label>
                    <input required className={styles.input} type="password" name="password" />

                    <Link href="/usuario/login" className={styles.link}>Já tem uma conta? Faça login</Link>

                    <div className={styles.btnalgn}>
                        <input type="reset" className={styles.btnReset} />
                        <button type="submit" className={styles.btnSubmit}>Cadastrar</button>
                    </div>
                </form>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}

async function cadastro(e, setAlert) {
    e.preventDefault();

    const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        identityDocument: e.target.cpf.value,
        address: e.target.address.value,
        password: e.target.password.value,
        type: "client"
    }

    console.log(data);

    const res = await fetch("/account/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const error = await res.json();
        console.log(error);
        setAlert(error.error)
    }

    else {
        redirect("/");
    }
}
