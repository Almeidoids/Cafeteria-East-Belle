import { redirect } from "next/navigation";

export default async function editAccount(e, bdData, setAlert) {
    e.preventDefault();

    let [items, data] = setAccountItemsBy(e, bdData);
    console.log(items);
    const type = bdData.type;
    console.log(bdData);

    items = deleteNotEdited(items, data);
    const res = await makeEditRequestBy(type, data.name, items);

    if (!res.ok) {
        const { error } = await res.json();
        setAlert(error);
    }
    else {
        redirectBy(type, items, data);
    }
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

function redirectBy(type, items, data) {
    if (type === "supplier") {
        console.log("fornecedor");
        redirect(`/comercial/fornecedor/`);
    }
    if (type === "client") {
        console.log("cliente");
        redirect(`/`);
    }
}