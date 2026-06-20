// stles
import styles from "../style/fornecedor.module.css"

export default function BackBtn({onClick}) {
    return (
        <button className={styles.headerBtn} onClick={onClick}>
            {"<"} <span className={styles.textBtn}>Voltar</span>
        </button>
    )
}