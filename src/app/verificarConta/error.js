import { useEffect } from "react";

// Componentes
import Menu from "../../../components/menu";
import Rodape from "../../../components/rodape";

// Fontes
import { candal } from "../../../public/fonts/fonts";


export default function VerificarConta({ error }) {
    useEffect(() => console.error(error), []);

    return (
        <div style={candal.style}>
            <Menu />

            <div style={{ display: "flex", alignItems: "center", height: "90vh" }}>
                <h2 style={{ textAlign: "center", width: "100%" }}>Algo deu errado, verifique o console para mais informaçṍes.</h2>
                <h5 style={{ textAlign: "center", width: "100%", marginTop: 15 }} >Recarregue a página para mais informações</h5>
            </div>

            <Rodape />
        </div>
    )
}
