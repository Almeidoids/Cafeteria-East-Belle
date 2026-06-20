"use client"

import { useRef, useEffect, useState } from "react"

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape"
import Alert from "../../../../components/alert"

//Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../../../../style/contato.module.css"

//Fontes
import { candal } from "../../../../public/fonts/fonts";

export default function Contatos() {
    const menu = useRef(null);
    const [answer, setAnswer] = useState("");
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState(false);
    
    useEffect(() => {
        menu.current.style.position = "fixed";
        menu.current.style.top = 0;
        menu.current.style.zIndex = 2;
     }, []);

    const limpar = () => {
        setAnswer("");
        setName("");
        setLastName("");
        setEmail("");   
    }

    return (
        <div style = {candal.style}>
            <Menu ref = {menu} />
            <form onSubmit = {async (e) => await launchEmail(e, name, lastName, email, setAlert)}>
                <div className = {styles.contatos} key = "contatar">
                    <input 
                        type = "text" 
                        name = "Pergunta" 
                        placeholder = "Sua pergunta" 
                        className = {styles.inputs} 
                        value = {answer}
                        onChange = {e => setAnswer(e.target.value)}
                        required
                    />
                    <br />
                    <input 
                        type = "text" 
                        name = "Nome" 
                        placeholder = "Nome" 
                        className = {styles.inputs}
                        value = {name} 
                        onChange = {e => setName(e.target.value)}
                        required 
                    />
                    <br/>
                    <input 
                        type = "text" 
                        name = "Sobrenome" 
                        placeholder = "Sobrenome" 
                        className = {styles.inputs}
                        value = {lastName} 
                        onChange = {e => setLastName(e.target.value)}
                        required 
                    />
                    <br/>
                    <input 
                        type = "email" 
                        name = "Email" 
                        placeholder = "E-mail" 
                        className = {styles.inputs}
                        value = {email} 
                        onChange = {e => setEmail(e.target.value)}
                        required 
                    />
                    <br/>
                    <div className = {styles.organization}>
                        <input type = "reset" className = {`btn btn-primary ${styles.buttons}`} name = "Limpar" onClick = {() => limpar()} />
                        <button type = "submit" className = {`btn btn-primary ${styles.buttons}`} name = "Enviar">Enviar</button>
                    </div>
                </div>
            </form>
            <Rodape className = {styles.footerR}/>

            {alert &&
                <Alert alert = {alert} style = {{display: alert ? "flex" : "none", backgroundColor: error ? "#D81159" : "#40C9A2"}} setAlert = {setAlert} />
            }
        </div>
    )
}

async function launchEmail(e, name, lastName, email, setAlert, setError) {
    e.preventDefault();
    let data = {
        Nome: name,
        Sobrenome: lastName,
        Email: email
    };

    const res = await fetch("/api/launchEmail", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) setError(true)
    
    const result = await res.json();
    setAlert(result.text);
}