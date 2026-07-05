import { redirect } from "next/navigation";

export default async function editAccount(e, bdData, setAlert) {
    e.preventDefault();

    let [items, data] = setAccountItemsBy(e, bdData);
    const type = bdData.type;

    items = deleteNotEdited(items, data);
    const res = await makeEditRequestBy(type, data.name, items);
    leadResult(res, setAlert, type);
}

export function setAccountItemsBy(e, bdData) {
    const items = {
        name: e.target.name.value,
        email: e.target.email.value,
        address: e.target.address.value,
    }
    const { data } = bdData;
    delete data.type;

    return [items, data];
}

export function deleteNotEdited(items, data) {
    Object.entries(data).forEach(function ([key, value]) {
        if (items[key] === value) delete items[key];
    })

    return items;
}

export async function makeEditRequestBy(type, name, items) {
    const res = await fetch(`/account/${type}/${name}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
    });

    return res;
}

function leadResult(res, setAlert, type) {
    if (!res.ok) {
        setErrorAlert(setAlert, res);
    }
    else {
        redirectBy(type);
    }
}

async function setErrorAlert(alert, res) {
    const { error } = await res.json();
    setAlert(error);
}

function redirectBy(type) {
    if (type === "supplier") {
        console.log("fornecedor");
        redirect(`/comercial/fornecedor/`);
    }
    if (type === "client") {
        console.log("cliente");
        redirect(`/`);
    }
}

export async function redefinePassword(e, setAlert, userInfo) {
    e.preventDefault();

    const [ oldPassword, newPassword, repeatPassword ] = getPasswordsBy(e.target);

    if (newPassword === repeatPassword) {
        const res = await makeEditPasswordRequestBy(oldPassword, newPassword, `/account/${userInfo.type}/${userInfo.name}/edit/senha`);
        leadResult(res, setAlert, userInfo.type);
    }

    else {
        setAlert("Uma das senhas é inválida");
    }
}

function getPasswordsBy(target) {
    return [
        target.pass.value,
        target.newPasswordValue,
        target.repeatPassword.value
    ];
}

async function makeEditPasswordRequestBy(oldPassword, newPassword, path) {
    const data = { oldPassword, newPassword }

    const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    return res;
}