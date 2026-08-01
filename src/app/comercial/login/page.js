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
import { createMaskOf, removeMask } from "../../../../util/masks";

export default function Cadastro() {
    const refIdentityDocument = useRef(null);
    const [identityDocument, setIdentityDocument] = useState("");
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [isCpf, setIsCpf] = useState(false);

    useEffect(() => {
        verifyLogin()
            .then(() => {
                setTimeout(() => redirect(`/comercial/fornecedor/`), 1000 * 10);
                setIsLogged(true);
            })
            .catch((err) => setIsLogged(false));
    }, [])

    useEffect(() => {
        if (isCpf) {
            setIdentityDocument(createMaskOf(
                refIdentityDocument.current, /(\d{3})(\d{3})(\d{3})(\d{2})/, [".", ".", "-"]
            ))
        }
        else {
            setIdentityDocument(createMaskOf(
                refIdentityDocument.current, /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, [".", ".", "/", "-"]
            ))
        }
    }, [identityDocument]);

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
                    <label className={styles.lbl} htmlFor="identityDocument">{isCpf ? "CPF" : "CNPJ"}</label>
                    <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
                        <input
                            required
                            className={`${styles.input} ${styles.identityDocument}`}
                            type="text"
                            name="identityDocument"
                            pattern={isCpf ? "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" : "\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}"}
                            maxLength={isCpf ? 14 : 18}
                            ref={refIdentityDocument}
                            value={identityDocument}
                            onChange={(e) => setIdentityDocument(e.currentTarget.value)}
                        />
                        <input
                            type="checkbox"
                            name="cpfCheckbox"
                            className={styles.activeCpf}
                            onChange={(e) => {
                                setIdentityDocument(changeCpfCheckbox(
                                    setIsCpf, e.currentTarget.checked, refIdentityDocument.current.value
                                ));
                            }}
                        />
                        <label htmlFor="cpfCheckbox" style={{ fontSize: 12 }} className={`${candal.className}`}>CPF</label>
                    </div>
                    <label className={styles.lbl} htmlFor="password">Senha</label>
                    <input required className={styles.input} type="password" name="password" />

                    <Link href="/comercial/cadastro" className={styles.link}>Não tem uma conta? Faça seu cadastro</Link>

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
        identifier: e.target.identityDocument.value,
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
        setAlert(error.err)
    }
    else {
        redirect(`/comercial/fornecedor`);
    }
}

function changeCpfCheckbox(setIsCpf, isChecked, value) {
    setIsCpf(isChecked);
    return removeMask(value);
}
