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
import { verifyLogin } from "../../../../util/authentication";

export default function Cadastro() {
    const refIdentityDocument = useRef(null);
    const [identityDocument, setIdentityDocument] = useState("");
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [isCpf, setIsCpf] = useState(false);

    useEffect(() => {
        verifyLogin(setIsLogged)
            .then(() => setTimeout(() => redirect(`/comercial/fornecedor/`), 1000 * 2))
            .catch();
    }, [])

    useEffect(() => {
        if (isCpf) {
            setIdentityDocument(setFormatToIdentityDocument(
                refIdentityDocument.current, /(\d{3})(\d{3})(\d{3})(\d{2})/, [".", ".", "-"]
            ))
        }
        else {
            setIdentityDocument(setFormatToIdentityDocument(
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
                <form className={styles.form} onSubmit={(e) => cadastro(e, setAlert)}>
                    <label className={styles.lbl} htmlFor="name">Nome da loja ou fornecedor</label>
                    <input required className={styles.input} type="text" name="name" />
                    <label className={styles.lbl} htmlFor="email">Email para contato</label>
                    <input required className={styles.input} type="email" name="email" />
                    <label className={styles.lbl} htmlFor="identityDocument">{isCpf ? "CPF" : "CNPJ"}</label>
                    <div style={{ display: "flex", alignItems: "center", padding: 0 }}>
                        <input
                            required
                            className={`${styles.input} ${styles.identityDocument}`}
                            type="text"
                            name="identityDocument"
                            pattern={isCpf ? "\d{3}\.\d{3}\.\d{3}-\d{2}" : "\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}"}
                            maxLength={isCpf ? 14 : 18}
                            value = {identityDocument}
                            ref={refIdentityDocument}
                            onChange={(e) => setIdentityDocument(e.currentTarget.value)}
                        />
                        <input 
                            type="checkbox" 
                            name="cpfCheckbox" 
                            className={styles.activeCpf} 
                            onChange = {(e) => {
                                setIdentityDocument(changeCpfCheckbox(
                                    setIsCpf, e.currentTarget.checked, refIdentityDocument.current.value
                                ));
                            }} 
                        />
                        <label htmlFor="cpfCheckbox" style={{ fontSize: 12 }} className={`${candal.className}`}>CPF</label>
                    </div>
                    <label className={styles.lbl} htmlFor="address">Endereço da loja ou fabricante</label>
                    <input required className={styles.input} type="text" name="address" />
                    <label className={styles.lbl} htmlFor="password">Senha</label>
                    <input required className={styles.input} type="password" name="password" />

                    <Link href="/comercial/login" className={styles.link}>Já tem uma conta? Faça login</Link>

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

function setFormatToIdentityDocument(refIdentityDocument, regex, formatMasks) {
    let updatedIdentityDocument = refIdentityDocument.value.replace(regex,(match, ...args) => {
        return formatDocument(args.slice(0, -2), formatMasks);
    });

    updatedIdentityDocument = removeExcess(updatedIdentityDocument, refIdentityDocument.maxLength);
    return updatedIdentityDocument;
}

function formatDocument(args, formatMasks) {
    let finalFormat = "";

    args.forEach(function (value, i) {
        finalFormat += i >= formatMasks.length ? value : value + formatMasks[i];
    })

    return finalFormat;
}

function removeExcess(text, maxLen) {
    if (text.length > maxLen) {
        let numberOfTextToBeRemoved = text.length - maxLen;
        text = text.slice(0, -numberOfTextToBeRemoved);
    }

    return text;
}

async function cadastro(e, setAlert) {
    e.preventDefault();

    const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        cnpj_cpf: e.target.identityDocument.value,
        address: e.target.address.value,
        password: e.target.password.value,
        type: "supplier"
    }

    const res = await fetch("/account/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })


    if (!res.ok) {
        const error = await res.json();
        setAlert(error.error)
    }
    else {
        redirect(`/comercial/fornecedor`);
    }
}

function changeCpfCheckbox(setIsCpf, isChecked, value) {
    setIsCpf(isChecked);
    return removeMask(value);
}

function removeMask(text) {
    return text.replace(/\D/g, "");
}