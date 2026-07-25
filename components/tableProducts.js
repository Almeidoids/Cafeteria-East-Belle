"use client";

import { useRef, useEffect, useState,} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Estilos
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import styles from "../style/tableProducts.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";


// Fontes
import { candal, caveat } from "../public/fonts/fonts";

// Componentes
import ModalConfirm from "./modalConfirm";
import Alert from "./alert";

// Util
import createRefList from "../util/createRefList";

export default function TableProducts({ products, setProducts, onError, className, ref }) {
    const [search, setSearch] = useState("");
    const [listProducts, setListProducts] = useState([]);
    const [showModalExAll, setShowModalExAll] = useState(false);
    const [showModalSaveAll, setShowModalSaveAll] = useState(false);
    const [actionsOpen, setActionsOpen] = useState(false);
    const [listEdit, setListEdit] = useState([]);
    const [showButtonSaveAll, setShowButtonSaveAll] = useState(false);
    const router = useRouter();
    const header = ["Nome", "Quantidade", "Preço unidade", "Oferta", "Preço total", "Compras"];

    useEffect(() => {
        setListProducts(products);
        setListEdit(setListEditDefault(listEdit, products.length));
    }, [products]);

    useEffect(() => {
        const resArr = products.filter(value => value.name.includes(search))

        setListProducts(resArr);
    }, [search])

    useEffect(() => {
        let showButton = false;
        for (let i of listEdit) {
            if (Object.keys(i).length > 1) {
                showButton = true;
                break;
            }
        }

        setShowButtonSaveAll(showButton);
    }, [listEdit]);

    return (
        <div>
            <table className={`${styles.table} ${candal.variable} ${caveat.variable}`} ref={ref}>
                <thead className={styles.tableHead}>

                    <tr className={styles.title}>
                        <td>
                            <input
                                type="text"
                                className={styles.search}
                                placeholder="Pesquisar"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </td>
                        <td className={styles.titletxt} colSpan={actionsOpen ? 5 : 4} ><span>Produtos</span></td>
                        <td className={styles.addProducts}>

                            <Link href={`/comercial/fornecedor/produto/0`}>
                                <button className={styles.button}>
                                    <span>
                                        Adicionar Produto
                                    </span>
                                    <i className={`bi bi-plus-circle-fill ${styles.icon}`} />
                                </button>
                            </Link>

                        </td>
                    </tr>

                    <tr className={styles.headers}>
                        {header.map((item, i) => {
                            return <th key={i}><span>{item}</span></th>
                        })}

                        <th />
                    </tr>

                </thead>

                <tbody>
                    {listProducts.map((item, i) => {
                        return (
                            <TableRow
                                listEdit={listEdit}
                                products={products}
                                setActionsOpen={setActionsOpen}
                                setListEdit={setListEdit}
                                item={item}
                                key={i}
                                index={i}
                                setProducts={setProducts}
                                onError={onError}
                            />
                        )
                    })}
                </tbody>

                <tfoot className={styles.footer}>
                    <tr>
                        <td colSpan={actionsOpen ? 7 : 6}>
                            <div>
                                <button
                                    className={styles.buttonAlert}
                                    onClick={() => setListEdit(value => {
                                        value = setListEditDefault(value, listProducts.length)
                                        return [...value];
                                    })}
                                    style={{ display: showButtonSaveAll ? "" : "none" }}
                                >
                                    Cancelar Todos
                                </button>
                                <button
                                    className={styles.button}
                                    onClick={() => setShowModalSaveAll(true)}
                                    style={{ display: showButtonSaveAll ? "" : "none" }}
                                >
                                    Salvar Todos
                                </button>
                                <button 
                                    className={styles.buttonAlert} 
                                    onClick={() => setShowModalExAll(true)}
                                    style={{ display: showButtonSaveAll ? "none" : "" }}
                                >
                                        Excluir Todos
                                    </button>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>

            {showModalExAll &&
                <ModalConfirm setShowModal={setShowModalExAll} onClick={() => { excludeAll(onError, setShowModalExAll, setProducts) }} >
                    <span className={styles.textBody}>Deseja Excluir todos os produtos?</span>
                </ModalConfirm>
            }

            {showModalSaveAll &&
                <ModalConfirm setShowModal={setShowModalSaveAll} onClick={() => { editAll(onError, listEdit, router, setShowModalSaveAll) }} >
                    <span className={styles.textBody}>Deseja Salvar todos os produtos?</span>
                </ModalConfirm>
            }

        </div>
    )
}

function TableRow({ listEdit, setListEdit, setActionsOpen, products, setProducts, item, onError, index }, key) {
    const liRefsOptions = useRef([]);
    const [idEx, setIdEx] = useState(null);
    const promotion = (item.price * item.offer) / 100;

    useEffect(() => {
        createRefList(products.length, liRefsOptions.current);
    }, [products]);

    return (
        <tr
            className={styles.tbody}
            style={caveat.style}
            onMouseEnter={() => {
                showActionButtons(setActionsOpen, true, liRefsOptions.current[key]);
            }}
            onMouseLeave={() => {
                showActionButtons(setActionsOpen, false, liRefsOptions.current[key]);
            }}
        >
            {listEdit[index] !== undefined &&
                <>
                    <InputData
                        itemkey={"name"}
                        val={item.name}
                        item={item}
                        key={`${item.id}-name`}
                        listEditValue={listEdit[index]}
                        setListEdit={setListEdit}
                    />
                    <InputData
                        itemkey={"quantity"}
                        val={item.quantity}
                        item={item}
                        key={`${item.id}-quantity`}
                        listEditValue={listEdit[index]}
                        setListEdit={setListEdit}
                    />
                    <InputData
                        itemkey={"price"}
                        val={item.price}
                        item={item}
                        key={`${item.id}-price`}
                        listEditValue={listEdit[index]}
                        setListEdit={setListEdit}
                    />
                    <InputData
                        itemkey={"offer"}
                        val={item.offer}
                        item={item}
                        key={`${item.id}-offer`}
                        listEditValue={listEdit[index]}
                        setListEdit={setListEdit}
                    />

                    <td>{item.offer === 0 ? item.price : (item.price - promotion).toFixed(2)}</td>
                    
                    <InputData
                        itemkey={"buyed"}
                        val={item.buyed}
                        item={item}
                        key={`${item.id}-buyed`}
                        listEditValue={listEdit[index]}
                        setListEdit={setListEdit}
                    />

                    <td
                        ref={e => liRefsOptions.current[key] = e}
                        style={{ textAlign: "right", display: "none" }}
                    >
                        {Object.keys(listEdit[index]).length <= 1 &&
                            <div>
                                <button className={`${styles.buttontd} ${styles.buttonAlert}`} onClick={() => setIdEx(item.id)} >
                                    <span>Excluir</span>
                                    <i className="bi bi-trash" />
                                </button>

                                <Link href={`/comercial/fornecedor/produto/${item.id}`}>
                                    <button className={`${styles.buttontd} ${styles.button}`}>
                                        <span>Editar</span>
                                        <i className="bi bi-pen" />
                                    </button>
                                </Link>
                            </div>
                        }

                        {Object.keys(listEdit[index]).length > 1 &&
                            <div>
                                <button
                                    className={`${styles.buttontd} ${styles.buttonAlert}`}
                                    onClick={() => setListEdit(value => {
                                        value[index] = {};
                                        return [...value]
                                    })}
                                >
                                    <span>Cancelar</span>
                                    <i className="bi bi-x-circle" />
                                </button>

                                <button
                                    className={`${styles.buttontd} ${styles.button}`}
                                    onClick={() => saveOneItem(listEdit[index], onError, setProducts, setListEdit, index)}
                                >
                                    <span>Salvar</span>
                                    <i className="bi bi-pen" />
                                </button>
                            </div>
                        }
                    </td>
                </>
            }

            {idEx &&
                <td colSpan={0} style={{ textAlign: "left" }}>
                    <ModalConfirm setShowModal={setIdEx} onClick={() => { excludeOne(onError, setIdEx, idEx, setProducts) }} >
                        <span className={styles.textBody}>Deseja Excluir este produto?</span>
                    </ModalConfirm>
                </td>
            }
        </tr>
    )

}

function InputData({ val, itemkey, item, listEditValue, setListEdit }) {
    const [inputvalue, setInputValue] = useState(val);
    const inputWidth = typeof val === "string" ? val.length * 8 : val.toString().length * 8;
    const isEditable = ["name", "price", "quantity", "offer"];

    return (
        <td itemkey={val}>
            {(listEditValue[`${itemkey}`] === undefined && itemkey !== "id") &&
                <>
                    {(itemkey === "quantity" && val <= 0) &&
                        <span
                            className={styles.quantityIsZero}
                            onDoubleClick={() => { changeListEdit(setListEdit, item, itemkey, val, listEditValue) }}
                        >
                            {val}
                        </span>
                    }

                    {(itemkey !== "quantity" || (itemkey === "quantity" && val > 0)) &&
                        <span
                            onDoubleClick={() => { isEditable.includes(itemkey) ? changeListEdit(setListEdit, item, itemkey, val, listEditValue) : null }}
                        >
                            {
                                `${val}${itemkey === "offer" ? "%" : ""}`
                            }
                        </span>
                    }
                </>
            }
            {(listEditValue[itemkey] !== undefined && itemkey !== "id") &&
                <input
                    defaultValue={val}
                    onChange={(e) => listEditValue[itemkey] = updateInputs(e, setInputValue)}
                    className={styles.inputs}
                    style={{ width: inputWidth }}
                />
            }
        </td>
    )
}

async function excludeAll(onError, setShowModalExAll, setProducts) {
    const res = await fetch(`/comercial/fornecedor/produto`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const result = await res.json();

        onError(result.err);
    }

    else {
        onError("Dados excluidos com sucesso");
        setProducts([]);
    }

    setShowModalExAll(false);
}

async function excludeOne(onError, setIdEx, idEx, setProducts) {
    const res = await fetch(`/comercial/fornecedor/produto/delete/${idEx}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
        const result = await res.json();

        onError(result.err);
    }

    else {
        onError("Dado excluido com sucesso");

        setProducts((item) => {
            return item.filter((value) => value.id !== idEx)
        });
    }

    setIdEx(null);
}

function showActionButtons(setActionsOpen, value, liRefOptions) {
    setActionsOpen(action => {
        liRefOptions.style.display = value ? "block" : "none";
        action = value;
        return action
    });
}

function changeListEdit(setListEdit, item, key, val, listEditValue) {
    listEditValue["_id"] = item.id;
    listEditValue[key] = val;
    setListEdit(value => {
        return [...value]
    });
};

function updateInputs(e, setInputValue) {
    setInputValue(e.target.value);

    let width = Number(e.target.style.width.replace("px", ""));
    width = e.target.value.length * 12;

    e.target.style.width = width >= 200 ? "200px" : `${width}px`;

    return e.target.value;
}

async function saveOneItem(item, onError, setProducts, setListEdit, index) {
    const id = item._id;
    const formData = new FormData();

    delete item.id;

    formData.append("items", JSON.stringify(item));

    const res = await fetch(`/comercial/fornecedor/produto/edit/${id}`, {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        const result = await res.json();
        onError(result.err);
    }

    else {
        const keys = Object.keys(item);

        onError("Item atualizado com sucesso!");

        setProducts((value) => {
            return value.map((val, valIndex) => {
                if (valIndex === index) {
                    keys.forEach(function (key) {
                        val[key] = item[key];
                    })

                    return val
                }
                else return val;
            })
        });

        setListEdit(value => {
            value[index] = { _id: id };
            return [...value]
        })
    }
}

async function editAll(onError, listEdit, router, setShowModalSaveAll) {
    listEdit = listEdit.filter(item => Object.keys(item).length !== 0);

    const res = await fetch(`/comercial/fornecedor/produto/editAll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listEdit)
    });

    if (!res.ok) {
        const result = await res.json();

        onError(result.err);
    }

    else {
        onError("Dados Salvos com sucesso");
        setShowModalSaveAll(false);

        setTimeout(() => {
            if (window !== undefined) {
                window.location.reload();
            }
        }, 1500)
    }
}

function setListEditDefault(listEdit, len) {
    for (let i = 0; i < len; i++) {
        listEdit[i] = {};
    }

    return listEdit;
}