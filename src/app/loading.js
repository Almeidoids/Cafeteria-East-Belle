import Image from "next/image"

//Estilos
import styles from "../../style/loading.module.css"

export default function Loading() {
    return (
        <div className = {styles.geral}>
            <div className = {styles.divBule}>
                <Image
                    src = "/images/loading/bule.png" 
                    className = {styles.bule}
                    height = {81}
                    width = {81}
                    alt = "bule"
                    priority
                />
            </div>
            <div className = {styles.carregamento} />
            <div className = {styles.espaco}>
                <div className = {styles.circulo}>
                    <div className = {styles.preenchimento}>
                        <Image 
                            src = "/images/loading/bailarina.png" 
                            className = {styles.bailarina} 
                            height = {30}
                            width = {30}
                            priority
                            alt = "bailarina"
                        />
                    </div>
                </div>
            </div>
        <h4 className = {styles.h4}>Carregando...</h4>
        </div>
    )
}