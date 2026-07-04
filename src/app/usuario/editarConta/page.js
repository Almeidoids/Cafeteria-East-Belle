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

export default function EditarConta() {
    const [alert, setAlert] = useState(null);
    const [isLogged, setIsLogged] = useState(false);
    const [bdDate, setBdData] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        async function getParams() {
            const user = await verifyLogin();

            if (user) {
                const res = await fetch(`/users/${user}/edit`);

                if (!res.ok) {
                    console.log("erro");
                    return;
                }

                const result = await res.json();
                const { data } = result;

                setBdData({ data });

                setName(data.name);
                setEmail(data.email);
                setAddress(data.address);
            }
        }

        async function verifyLogin() {
            const login = await logged(setIsLogged);

            if ("error" in login || login.type !== "client") {
                console.log(login);
                setReqError(login.error);
                setTimeout(() => redirect(`/`), 2000);
                return;
            }

            else return login.name;
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
                <form className={styles.form} onSubmit={(e) => edit(e, setAlert)} style = {{width: "40%"}}>
                    <label className={styles.lbl} htmlFor="name">Nome completo</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="text" 
                        name="name" 
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                    />
                    <label className={styles.lbl} htmlFor="email">Email</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="email" 
                        name="email" 
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                    <label className={styles.lbl} htmlFor="address">Endereço</label>
                    <input 
                        required 
                        className={styles.input} 
                        type="text" 
                        name="address" 
                        value = {name}
                        onChange = {(e) => setName(e.target.value)}
                    />

                    <div className={styles.btnalgn}>
                        <button className={styles.btnSubmit} style = {{backgroundColor: "#797D81", width: "30%"}}>Editar senha</button>
                        <input type="reset" className={styles.btnReset} style = {{width: "30%"}} />
                        <button type="submit" className={styles.btnSubmit} style = {{width: "30%"}}>Atualizar</button>
                    </div>
                </form>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
            <Rodape />
        </div>
    )
}

async function edit(e, setAlert) {
    e.preventDefault();

    const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        cpf: e.target.cpf.value,
        address: e.target.address.value,
        password: e.target.password.value,
    }

}
