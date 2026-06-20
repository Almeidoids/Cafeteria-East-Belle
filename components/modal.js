"use client"

//Estilos
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/modal.module.css";

export default function Modal({style, close, children}) {

    return (
        <div className = {`card ${styles.corpo}`} style = {style}>
          <div style = {{display: "flex"}}>
              <button 
                  type = "button" 
                  className = "btn-close" 
                  aria-label = "close"
                  style = {{marginLeft: "auto"}}
                  onClick = {close}    
              />
          </div>
         {children}
      </div>
    )
}