//Estilos
import styles from "../style/alert.module.css";

//Fontes
import { candal } from "../public/fonts/fonts";

export default function Alert({alert, style, setAlert}) {
    return (
        <div className = {`alert alert-success ${styles.alert}`} role = "alert" style = {style}>
            <div>
                <h4 style = {candal.style}>{alert}</h4>
            </div>
            <button type = "button" className = "btn-close" aria-label = "close" onClick = {() => {setAlert(null)}} />
        </div>
    )
}