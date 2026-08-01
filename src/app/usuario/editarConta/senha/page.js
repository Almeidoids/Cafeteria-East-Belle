"use client";

import { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

//Componentes
import Menu from "../../../../../components/menu"
import Rodape from "../../../../../components/rodape"
import Alert from "../../../../../components/alert";
import Authenticated from "../../../../../components/authenticated";

//estilos
import styles from "../../../../../style/cadastro.module.css"

//Fontes
import { candal } from "../../../../../public/fonts/fonts"

// Util
import { verifyLogin } from "../../../../../util/authentication";
import editAccount, { redefinePassword } from "../../../../../util/account";

export default function EditarConta() {
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(true);
    const [username, setUsername] = useState("");
    const [reqError, setReqError] = useState("");

    useEffect(() => {
        verifyLogin()
            .then(value => {
                setIsLogged(true);
                setUsername(value.name);
            })
            .catch(err => {
                setReqError(err.message);
                setIsLogged(false);
                setTimeout(() => redirect(`/`), 2000);
            });
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
                <form
                    className={styles.form}
                    onSubmit={(e) => redefinePassword(e, setAlert, { name: username, type: "client" })}
                    style={{ width: "40%" }}
                >
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
                        name="newPassword"
                    />
                    <label className={styles.lbl} htmlFor="reNewPass">Redigite a nova senha</label>
                    <input
                        required
                        className={styles.input}
                        type="password"
                        name="repeatPassword"
                    />

                    <div className={styles.btnalgn}>
                        <button type="submit" className={styles.btnSubmit} style={{ width: "30%" }}>Redefinir</button>
                    </div>
                </form>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}
