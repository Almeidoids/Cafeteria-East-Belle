"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../../../../../style/produtosF.module.css";

// Componentes
import BackBtn from "../../../../../../components/backBtn";
import Authenticated from "../../../../../../components/authenticated";
import Alert from "../../../../../../components/alert";

// Fontes
import { candal } from "../../../../../../public/fonts/fonts";

// functions
import { verifyLogin } from "../../../../../../util/authentication";
import { redefinePassword } from "../../../../../../util/account";

export default function EditarSenha({ }) {
    const [isLogged, setIsLogged] = useState(true);
    const [reqError, setReqError] = useState("");
    const [path, setPath] = useState("");
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        verifyLogin(setIsLogged)
            .then(value => setPath(value.name))
            .catch(() => {
                setReqError(login.error);
                setTimeout(() => redirect(`/comercial/cadastro`), 1000 * 10);
            })
    }, [])

    return (
        <div className={`${styles.background} ${candal.variable}`} >
            {!isLogged &&
                <Authenticated text={`${reqError}. Redirecionando`} img={"/images/icones/cup.png"} color={"#F9DBBD"} />
            }

            {isLogged &&
                <div>
                    <BackBtn onClick={() => redirect(`/comercial/fornecedor/`)} />

                    <form onSubmit={(e) => redefinePassword(e, setAlert, { name: path, type: "supplier" })} className={styles.editForm}>
                        <div className={`${styles.algnInputs} ${styles.algnEdtSupplier}`}>
                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="password" >Senha:</label>
                            <input
                                type="password"
                                name="pass"
                                className={`${styles.input}`}
                                required
                            />

                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="newPassword" >Nova senha:</label>
                            <input
                                type="password"
                                name="newPassword"
                                className={`${styles.input}`}
                                required
                            />

                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="repeatPassword" >Redigite a nova senha:</label>
                            <input
                                type="password"
                                name="repeatPassword"
                                className={`${styles.input}`}
                                required
                            />
                        </div>

                        <div className={styles.organization}>
                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.buttonSubmit}`}
                                name="Enviar"
                                style={{
                                    backgroundColor: "#40C9A2",
                                    border: "none",
                                    color: "#2B061E",
                                }}
                            >
                                Redefinir
                            </button>
                        </div>
                    </form>
                </div>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />

        </div>
    )
}
