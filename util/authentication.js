export default async function logged(setIsLogged) {
    const res = await fetch(`/authenticate`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })

    if (!res.ok) { 
        setIsLogged(false);
        const error = await res.json();
        return error;
    }
    else {
        const {user} = await res.json();

        setIsLogged(true);

        return user;
    }
}