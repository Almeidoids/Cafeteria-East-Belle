import { useRef, useState, useEffect } from "react";
import Image from "next/image";

//Estilos
import styles from "../style/changeImage.module.css";

//Fontes
import { caveat } from "../public/fonts/fonts";

//Funções
import { imageEffect } from "../util/CreateOrChangeImage";

export function ChangeImg({cropImage, setIndexImg, refFile, setShowModal}) {
    const refChangeImg = useRef(null);

    return (
        <div 
            className = {styles.algnFile}
            onMouseOver = {() => refChangeImg.current.classList.add(styles.changeImgAnimation)}
            onMouseOut = {() => refChangeImg.current.classList.remove(styles.changeImgAnimation)} 
        >
            <Image 
                src = {cropImage[0]}
                alt = "Imagem do produto"
                height = {5000}
                width = {5000}
                className = {styles.image}
            />
            
            <div 
                className = {styles.changeImg} 
                ref = {refChangeImg} 
                onClick = {() => {
                    setIndexImg(0);
                    refFile.current.click()
                }}
            >
                Trocar Imagem 
                <i className = {`bi bi-arrow-left-right`} style = {{marginLeft: 5}} />
            </div>

            <button 
                className = {`btn ${styles.btnAddMI}`} 
                type = "button"
                onClick = {() => setShowModal(true)}
                style = {{backgroundColor: "#797D81", color: "#F9DBBD"}}
            >
                Adicionar imagens de visualização
            </button>
        </div>
    )
}

export function ItensModal({cropImage, setIndexImg, setShowModal, refFile}) {
    const [imgList, setImgList] = useState(null);
    const refEffect = useRef(null);

    useEffect(() => {
        const list = cropImage.map((item, i) => {
            if (i === 0) return;
            return (
                <Image 
                    src = {item}
                    alt = "Imagem do produto"
                    height = {5000}
                    width = {5000}
                    className = {`${styles.image} ${styles.modalImage} ${styles.visualizer}`}
                    key = {i}
                    onClick = {() => {
                        setIndexImg(i);
                        refFile.current.click();
                    }}
                />
            )
        })

        setImgList(list);
    }, [cropImage]);

    return (
        <div className = {`${styles.algnModal} ${caveat.className}`}>
            <div className = {styles.imgList}>
                {imgList}
                {cropImage.length < 4 &&
                    <button 
                        type = "button" 
                        className = {`${styles.image} ${styles.btnImage} ${styles.modalImage} ${styles.visualizer}`}
                        onClick = {(e) => {
                            setIndexImg(cropImage.length);
                            imageEffect(e, refFile.current, refEffect.current)
                        }}
                    >
                        <div ref = {refEffect} />
                        <i className = {`bi bi-plus-circle-fill ${styles.iconImage}`} />
                    </button>
                }
            </div>
            <h4
                className = {styles.txtLenght}
                style = {{color: cropImage.length !== 4 ? "#2b061e" : "#D81159"}}
            >
                {cropImage.length - 1}/3
            </h4>
            <h5 className = {styles.modaltxt} >Imagens de visualização são maiores que imagens de capa, e serão as imagens mostradas na página de seu produto.</h5>
            <h5 className = {styles.modaltxt} >Adicione uma imagem ou clique em uma imagem especifica para trocá-la.</h5>
        </div>
    )
}