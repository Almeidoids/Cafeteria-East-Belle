// Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/dropdown.module.css";

// Fontes
import { candal } from "../public/fonts/fonts";

export default function Dropdown({children, text}) {
    return (
        <div className = {`dropdown ${candal.variable}`}>
            <button className = {`${styles.btn}`} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {text}
            </button>
            <ul className = {`dropdown-menu ${styles.menu}`}>
                {children}
            </ul>
        </div>
    )
} 