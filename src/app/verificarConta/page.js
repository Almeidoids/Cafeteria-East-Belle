// Componentes
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";

// Fontes
import { candal } from "../../../public/fonts/fonts";

export default function VerificarConta() {
    return (
        <div style = {candal.style}>
            <Menu />

            <div style = {{display: "flex", alignItems: "center", height: "90vh"}}>
                <h2 style = {{textAlign: "center", width: "100%"}}>Para verificar sua conta, clique no link do e-mail que lhe foi enviado.</h2>
            </div>

            <Rodape />
        </div>
    )
}