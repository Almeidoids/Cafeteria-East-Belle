import Image from "next/image";
import Form from "next/form";

//Componentes
import Menu from "../../../../components/menu"
import Rodape from "../../../../components/rodape"
import Formulario from "../../../../components/formulario";
import ModalConfirm from "../../../../components/modalConfirm";

//Fontes
import { candal, caveat } from "../../../../public/fonts/fonts"

//Estilos
import styles from "../../../../style/p.module.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Constantes
import produtos from "../../../../constants/produtos";

export default async function p({params}) {
    const {p} = await params
    const product = produtos[Number(p - 1)];
    const subtract = ((product.originalp * product.offer) / 100).toFixed(2);

    return (
        <div style = {candal.style} className = {caveat.variable}>
            <Menu style = {{position: "fixed", top: 0}} />
            <div className = {styles.alinhamento}>
                <div className = {styles.alinhamentoProduto}>
                    <h1 className = {styles.titulo}>{product.name}</h1>
                    {product.offer !== 0 &&
                        <h5 style = {{fontSize: 14, color: "#604456"}} className = {styles.titulo}>Com {product.offer}% de desconto</h5>
                    }
                    <div style = {{marginTop: "5%"}}>
                        <p className = {styles.texto}>{product.text}</p>
                    </div>
                    <div className = {styles.txtcompra}>
                        {product.offer !==0 &&
                            <p className = {styles.oferta}>{product.originalp}</p>
                        }
                        <p className = {styles.preco}>{(product.originalp - subtract).toFixed(2)}</p>
                        <Formulario product = {product} />
                    </div>
                </div>
                <div>
                    <Image
                        src = {product.imagep}
                        alt = {product.name}
                        height = {400}
                        width = {400}
                        className = {styles.imagem}
                    />
                </div>
            </div>
            <Rodape className = {styles.footerR} />
        </div>
    )
}