// Componentes
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";

// Fontes
import { candal } from "../../../public/fonts/fonts";

// Util
import { verifyLogin } from "../../../util/authentication";

export default async function VerificarConta() {
    const user = await getUser();
    const sendEmail = await throwEmail(user.name);

    return (
        <div style={candal.style}>
            <Menu />

            <div style={{ display: "flex", alignItems: "center", height: "90vh" }}>
                <h2 style={{ textAlign: "center", width: "100%" }}>Para verificar sua conta, clique no link do e-mail que lhe foi enviado.</h2>
            </div>

            <Rodape />
        </div>
    )
}

async function getUser() {
    return verifyLogin();
}

async function throwEmail(username) {
    const res = await fetch("/account/sendVerifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(username)
    });

    const result = await res.json();

    if (!res.ok) {
        throw new Error(result.err);
    }
}
