"use client";

import { useState, useRef, useEffect } from "react";
import { redirect } from "next/navigation";

//Estilos
import styles from "../../../../../../style/produtosF.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

//Fontes
import { candal, caveat } from "../../../../../../public/fonts/fonts";

// Funções
import { cropper, imageEffect, getImage } from "../../../../../../util/CreateOrChangeImage";
import { verifyLogin } from "../../../../../../util/authentication";

//Componentes
import Modal from "../../../../../../components/modal";
import { ChangeImg, ItensModal } from "../../../../../../components/changeImage";
import Alert from "../../../../../../components/alert";
import Authenticated from "../../../../../../components/authenticated";
import { Offer, Cropping } from "../../../../../../components/createProducts";
import BackBtn from "../../../../../../components/backBtn";

export default function Produtos({ params }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [offer, setOffer] = useState("");
    const [image, setImage] = useState(null);
    const [sendImage, setSendImage] = useState([]);
    const [cropImage, setCropImage] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [indexImg, setIndexImg] = useState(0);
    const [optionals, setOptionals] = useState(false);
    const [alert, setAlert] = useState(false);
    const [path, setPath] = useState(null);
    const [isLogged, setIsLogged] = useState(true);
    const [reqError, setReqError] = useState("");
    const [bdData, setBdData] = useState(null);
    const refFile = useRef(null);
    const refBtnImg = useRef(null);
    const refEffect = useRef(null);
    const refLabel = useRef(null);

    useEffect(() => {
        async function getParams() {
            const { produtos } = await params;
            let name;
            try {
                name = await verifyLogin(setIsLogged)
                    .then(value => value.name);
            }
            catch (err) {
                setReqError(err.message);
                setTimeout(() => redirect(`/comercial/cadastro`), 1000 * 2);
            }

            setPath({ produtos, name });

            if (produtos !== "0") {
                const res = await fetch(`/comercial/fornecedor/produto/edit/${produtos}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!res.ok) {
                    return;
                }

                const result = await res.json();
                const { data } = result;
                const iArr = [];
                const bArr = [];

                data.images.forEach(function (value) {
                    iArr.push(getImage(value).image);
                    bArr.push(getImage(value).blobImage);
                })

                setBdData({ data: data, bArr: bArr });

                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setQuantity(data.quantity);
                setOffer(data.offer);
                setCropImage(iArr);
                setSendImage(bArr);

                (data.offer === null || data.offer === "0") ? setOptionals(false) : setOptionals(true);
            }
        }

        getParams();

    }, []);

    return (
        <div className={`${styles.background} ${candal.variable}`}>

            {!isLogged &&
                <Authenticated text={`${reqError}. Redirecionando`} img={"/images/icones/cup.png"} color={"#F9DBBD"} />
            }

            {isLogged &&
                <div>
                    <BackBtn onClick={() => redirect(`/comercial/fornecedor`)} />

                    <form onSubmit={(e) => postForm(e, sendImage, path, setAlert, bdData)} >

                        <div className={styles.algn}>
                            <div className={styles.algnInputs}>
                                <label className={styles.lbl} htmlFor="name" >Nome do Produto</label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`${styles.input}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <label className={styles.lbl} htmlFor="description" >Descrição do Produto</label>
                                <textarea
                                    name="description"
                                    className={`${styles.input} ${styles.resume}`}
                                    required
                                    rows="4"
                                    cols="50"
                                    maxLength="300"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>

                                <div className={styles.algnImage} >
                                    <label
                                        htmlFor="imagem"
                                        className={styles.lbl}
                                        ref={refLabel}
                                        style={{
                                            textAlign: "center",
                                            display: !cropImage[0] ? "initial" : "none"
                                        }}
                                    >
                                        Adicione uma Imagem de capa para seu produto
                                    </label>

                                    {cropImage[0] &&
                                        <ChangeImg
                                            cropImage={cropImage}
                                            refFile={refFile}
                                            setIndexImg={setIndexImg}
                                            setShowModal={setShowModal}
                                        />
                                    }

                                    <button
                                        type="button"
                                        className={`${styles.image} ${styles.btnImage}`}
                                        ref={refBtnImg}
                                        onClick={(e) => imageEffect(e, refFile.current, refEffect.current)}
                                        style={{ display: !cropImage[0] ? "initial" : "none" }}
                                    >
                                        <div ref={refEffect} />
                                        <i className={`bi bi-plus-circle-fill ${styles.iconImage}`} />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="imagem"
                                        className={styles.input}
                                        ref={refFile}
                                        onChange={(e) => changeImage(e.target, setImage, refBtnImg.current, refLabel.current)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.algnInputs2} >
                            <div className={styles.divNumber}>
                                <label className={styles.lbl} htmlFor="price" >Preço</label>
                                <input
                                    type="number"
                                    name="price"
                                    step={"0.01"}
                                    className={`${styles.input}`}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.divNumber}>
                                <label className={styles.lbl} htmlFor="quantity" >Quantidade de produtos no estoque</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    className={`${styles.input}`}
                                    required
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>

                            <label className={styles.lbl} >
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={optionals}
                                    onChange={() => { setOptionals(!optionals) }}
                                />
                                {" Adicionar promoção"}
                            </label>
                        </div>

                        {optionals &&
                            <Offer offer={offer} setOffer={setOffer} />
                        }

                        <div className={styles.organization}>
                            <input
                                type="reset"
                                className={`btn btn-primary ${styles.buttonReset}`}
                                style={{
                                    backgroundColor: "#D81159",
                                    border: "none",
                                    color: "#2B061E"
                                }}
                                onClick={() => clear(
                                    setName, setDescription, setCropImage,
                                    setPrice, setQuantity, setOffer,
                                    setOptionals
                                )}
                            />
                            <button
                                type="submit"
                                className={`btn btn-primary ${styles.buttonSubmit}`}
                                name="Enviar"
                                style={{
                                    backgroundColor: "#40C9A2",
                                    border: "none",
                                    color: "#2B061E",
                                }}
                            >
                                {(path && path.produtos === "0") ? "Enviar" : "Editar"}
                            </button>
                        </div>
                    </form>
                </div>
            }

            {(image) &&
                <Cropping
                    image={image}
                    indexImg={indexImg}
                    sendImage={sendImage}
                    setCropImage={setCropImage}
                    setImage={setImage}
                    setSendImage={setSendImage}
                />
            }

            {showModal &&
                <>
                    <div className={styles.backgroundModal} />
                    <Modal close={() => setShowModal(false)}  >
                        <ItensModal cropImage={cropImage} setIndexImg={setIndexImg} setShowModal={setShowModal} refFile={refFile} />
                    </Modal>
                </>
            }

            <Alert alert={alert} setAlert={setAlert} style={{ backgroundColor: "#D81159", display: alert ? "flex" : "none" }} />
        </div>
    )
}

function changeImage(e, setImage) {
    const files = e.files;
    const reader = new FileReader();

    reader.onloadend = function () {
        setImage([reader.result]);
    }

    reader.readAsDataURL(files[0]);
}

function clear(setName, setDescription, setCropImage, setPrice, setQuantity, setOffer, setOptionals) {
    setName("");
    setDescription("");
    setCropImage([]);
    setPrice("");
    setQuantity("");
    setOffer("");
    setOptionals(false);
}

async function postForm(e, images, path, setAlert, bdData) {
    e.preventDefault();
    let offer = 0;

    if (e.target.offer) offer = e.target.offer.value;

    const formData = new FormData();

    const items = {
        name: e.target.name.value,
        description: e.target.description.value,
        price: Number(e.target.price.value).toFixed(2),
        quantity: Number(e.target.quantity.value),
        offer: Number(offer),
        buyed: 0
    }

    if (path.produtos === "0") {
        items.supplierName = localStorage.getItem("supplier");
        formData.append("items", JSON.stringify(items));

        formAddImage(formData, images);

        const res = await fetch(`/comercial/fornecedor/produto`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            setAlert(<div dangerouslySetInnerHTML={{ __html: error.err }} />);
        }
        else {
            redirect(`/comercial/fornecedor`);
        }
    }

    else {
        const { data, bArr } = bdData;
        let change = true;


        Object.entries(data).forEach(function ([key, value]) {
            if (items[key] === value) delete items[key];
        })

        if (images.length === bArr.length) {
            change = false;

            for (let i = 0; i < bArr.length; i++) {
                const buffer1 = await images[i].arrayBuffer();
                const buffer2 = await bArr[i].arrayBuffer();

                if (buffer1 !== buffer2) {
                    change = true;
                    break;
                }

                else {
                    const view1 = new Uint8Array(buffer1);
                    const view2 = new Uint8Array(buffer2);

                    for (let j = 0; j < view1.byteLength; j++) {
                        if (view1[j] !== view2[j]) {
                            change = true;
                            break;
                        }
                    }

                    if (change === true) break;
                }
            }
        }

        if (change) {
            formAddImage(formData, images);
        }

        formData.append("items", JSON.stringify(items));

        const res = await fetch(`/comercial/fornecedor/produto/edit/${path.produtos}`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const error = await res.json();
            setAlert(error.err);
        }

        else {
            redirect(`/comercial/fornecedor`);
        }
    }
}

function formAddImage(formData, images) {
    if (images) {
        images.forEach(function (value) {
            formData.append(`image`, value)
        })
    }
}
