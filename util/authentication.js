export async function logged() {
    const res = await fetch(`/account`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
        const error = await res.json();
        return error;
    }
    else {
        const { user } = await res.json();
        return user;
    }
}

export async function verifyLogin() {
    const login = await logged();
    if ("error" in login) throw new Error(login.error);
    else return login;
}
