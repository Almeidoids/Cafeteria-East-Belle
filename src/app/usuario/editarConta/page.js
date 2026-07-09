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
import editAccount from "../../../../util/account";

export default function EditarConta() {
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(true);
    const [bdDate, setBdData] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [reqError, setReqError] = useState("");

    useEffect(() => {
        async function getParams() {
            let user = "";

            try {
                user = await verifyLogin(setIsLogged).name;
            }
            catch (err) {
                setReqError(err.message);
                setTimeout(() => redirect(`/`), 2000);
            }

            const res = await fetch(`/account/client/${user}/edit`);

            if (!res.ok) {
                console.log("erro");
                return;
            }

            const result = await res.json();
            const { data } = result;

            setBdData({ data, type: "client" });

            setName(data.name);
            setEmail(data.email);
            setAddress(data.address);
        }

        getParams();

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
                <form className={styles.form} onSubmit={(e) => editAccount(e, bdDate, setAlert)} style={{ width: "40%" }}>
                    <label className={styles.lbl} htmlFor="name">Nome completo</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label className={styles.lbl} htmlFor="email">Email</label>
                    <input
                        required
                        className={styles.input}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className={styles.lbl} htmlFor="address">Endereço</label>
                    <input
                        required
                        className={styles.input}
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <div className={styles.btnalgn}>
                        <Link href="/usuario/editarConta/senha" style={{ width: "30%" }} >
                            <button className={styles.btnSubmit} style={{ backgroundColor: "#797D81", width: "100%" }}>Editar senha</button>
                        </Link>
                        <button className={styles.btnReset} style={{ width: "30%" }} onClick={() => clear(setName, setEmail, setAddress)} >Redefinir</button>
                        <button type="submit" className={styles.btnSubmit} style={{ width: "30%" }}>Atualizar</button>
                    </div>
                </form>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}

function clear(setName, setEmail, setAddress) {
    setName("");
    setEmail("");
    setAddress([]);
}
