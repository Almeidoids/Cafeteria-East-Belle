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
import editAccount from "../../../../util/account";

export default function EditarConta() {
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        async function verifyLogin() {
            const login = await logged(setIsLogged);

            if ("error" in login || login.type !== "client") {
                setReqError(login.error);
                setTimeout(() => redirect(`/`), 2000);
                return;
            }

            else return login.name;
        }

        verifyLogin();

    }, []);

    return (
        <div className={candal.variable}>
            <Menu style={{ position: "fixed", top: 0 }} />
            {!isLogged &&
                <Authenticated
                    text={"Você não está logado. Redirecionando"}
                    color={"#2B061E"}
                />
            }

            {isLogged &&
                <form className={styles.form} onSubmit={(e) => formPost(e, setAlert)} style = {{width: "40%"}}>
                    <label className={styles.lbl} htmlFor="pass">Senha</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="password" 
                        name="pass"
                    />
                    <label className={styles.lbl} htmlFor="newPass">Nova senha</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="password" 
                        name="newPass" 
                    />
                    <label className={styles.lbl} htmlFor="reNewPass">Redigite a nova senha</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="password" 
                        name="reNewPass" 
                    />

                    <div className={styles.btnalgn}>
                        <button type="submit" className={styles.btnSubmit} style = {{width: "30%"}}>Redefinir</button>
                    </div>
                </form>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}

async function formPost(e, setAlert) {
    e.preventDefault();

    const oldPassword = e.target.pass.value;
    const newPassword = e.target.newPass.value;

    if (newPassword === e.target.reNewPass.value) {
        const data = { oldPassword, newPassword }


        const res = await fetch(`/account/client/edit/senha`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            const result = await res.json();
            console.log(result);

            setAlert(result.error);
        }

        else {
            redirect(`/`);
        }
    }

    else {
        setAlert("Uma das senhas é inválida");
    }
}