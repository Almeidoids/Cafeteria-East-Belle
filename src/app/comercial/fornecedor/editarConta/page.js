"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../../../../style/produtosF.module.css";

// Componentes
import Authenticated from "../../../../../components/authenticated"
import BackBtn from "../../../../../components/backBtn";
import Alert from "../../../../../components/alert";

// UTIL
import { verifyLogin } from "../../../../../util/authentication";
import editAccount from "../../../../../util/account";

// Fontes
import { candal } from "../../../../../public/fonts/fonts";

export default function EditSupplier({ }) {
    const [reqError, setReqError] = useState("");
    const [isLogged, setIsLogged] = useState(true);
    const [bdData, setBdData] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [path, setPath] = useState("");
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        async function getParams() {
            let fornecedor = "";

            try {
                fornecedor = await verifyLogin()
                    .then(value => {
                        setIsLogged(true);
                        return value.name
                    });
            }
            catch (err) {
                setReqError(login.error);
                setIsLogged(false);
                setTimeout(() => redirect(`/comercial/cadastro`), 1000 * 2);
            }

            const res = await fetch(`/account/supplier/${fornecedor}/edit`);

            console.log(fornecedor);
            setPath(fornecedor);

            if (!res.ok) {
                return;
            }

            const result = await res.json();
            const { data } = result;

            setBdData({ data, type: "supplier" });

            setName(data.name);
            setEmail(data.email);
            setAddress(data.address);
        }

        getParams();

    }, []);

    return (
        <div className={`${styles.background} ${candal.variable}`} >
            {!isLogged &&
                <Authenticated text={`${reqError}. Redirecionando`} img={"/images/icones/cup.png"} color={"#F9DBBD"} />
            }

            {isLogged &&
                <div>
                    <BackBtn onClick={() => redirect(`/comercial/fornecedor`)} />

                    <form onSubmit={(e) => editAccount(e, bdData, setAlert)} className={styles.editForm}>
                        <div className={`${styles.algnInputs} ${styles.algnEdtSupplier}`}>
                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="name" >Nome:</label>
                            <input
                                type="text"
                                name="name"
                                className={`${styles.input}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="name" >Email:</label>
                            <input
                                type="text"
                                name="email"
                                className={`${styles.input}`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label className={`${styles.lbl} ${styles.lblEdtSupplier}`} htmlFor="name" >Endereço:</label>
                            <input
                                type="text"
                                name="address"
                                className={`${styles.input}`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.organization}>
                            <Link href={`/comercial/fornecedor/editarConta/senha`}><button type="button" className={`btn ${styles.buttonPassword}`}>Redefinir senha</button></Link>
                            <input
                                type="reset"
                                className={`btn ${styles.buttonReset}`}
                                style={{
                                    backgroundColor: "#D81159",
                                    border: "none",
                                    color: "#2B061E"
                                }}
                                onClick={() => clear(setName, setEmail, setAddress)}
                            />

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
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
        </div>
    )
}

function clear(setName, setEmail, setAddress) {
    setName("");
    setEmail("");
    setAddress([]);
}
