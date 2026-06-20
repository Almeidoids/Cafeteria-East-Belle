import Image from "next/image";
import styles from "../style/authenticated.module.css";

export default function Authenticated({ text, img, color }) {
    return (
        <div className={styles.redirect}>
            <div className={styles.algnItems}>
                {img &&
                    <Image
                        src={img}
                        alt="icone copo quebrado"
                        height={60}
                        width={60}
                        className={styles.img}
                    />
                }

                {!img &&
                    <i 
                        className = {`bi bi-cup ${styles.img}`} 
                        style = {{color: "#2B061E", fontSize: 60}} 
                    />
                }

                <h1 style = {{color: color}}>{text}</h1>
            </div>
        </div>
    )
}