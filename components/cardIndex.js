import Image from "next/image";

//Fontes
import {caveat} from "../public/fonts/fonts"

//Estilos
import "bootstrap/dist/css/bootstrap.min.css"
import styles from "../style/cardIndex.module.css";

export default function CardIndex({name, description, image, onClick}, key) {
    //image === "" ? image = null : image;
    return(
        <div className = "card" style = {styleSheet.card}>
            <div>
                <Image
                    src = {image}
                    alt = {name}
                    width = {200}
                    height = {200}
                    className = {styles.cafes}
                />
            </div>
            <div style = {{height: "40%"}}>
                <h2 className = {styles.titulos}>{name}</h2>          
                <p style = {caveat.style} className = {styles.textos}>{description}</p>
            </div>
            <button type = "button" className = "btn btn-primary" style = {{backgroundColor: "#40C9A2", marginBottom: 10}} onClick = {onClick} >Veja Mais</button>
        </div>
    )
}

const styleSheet = {
    card: {
      width: "18rem",
      height: '30rem',
      backgroundColor: "#2b061e",
      margin: 50,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: ""
    },
  }