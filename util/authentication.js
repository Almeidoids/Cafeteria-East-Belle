export async function logged(setIsLogged) {
    const res = await fetch(`/account`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) {
        setIsLogged(false);
        const error = await res.json();
        return error;
    }
    else {
        const { user } = await res.json();

        setIsLogged(true);

        return user;
    }
}

export async function verifyLogin(setIsLogged) {
    const login = await logged(setIsLogged);
    if ("error" in login) throw new Error(login.error);
    else return login;
}

