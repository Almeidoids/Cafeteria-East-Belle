"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";

// Estilos
import styles from "../style/produtosF.module.css";

// Util
import { cropper } from "../util/CreateOrChangeImage";

export function Offer({ offer, setOffer }) {
    return (
        <div
            style={{ marginTop: "1rem" }}
            className={styles.algnInputs2}
        >
            <div className={styles.divNumber}>
                <label className={styles.lbl} htmlFor="offer" >Promoção (em porcentagem)</label>
                <input
                    type="number"
                    name="offer"
                    value={offer}
                    onChange={e => setOffer(e.target.value)}
                    className={`${styles.input}`}
                />
            </div>
        </div>
    )
}

export function Cropping({ image, setCropImage, setImage, sendImage, setSendImage, indexImg }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [ca, setCa] = useState({ x: 0, y: 0, width: 0, height: 0 });


    return (
        <div className={styles.cropArea}>
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, ca) => setCa(ca)}

            />
            <button className={styles.btnCrop} onClick={() => cropper(setCropImage, image, ca, setImage, indexImg, sendImage, setSendImage)}>Cortar</button>
        </div>

    )
}