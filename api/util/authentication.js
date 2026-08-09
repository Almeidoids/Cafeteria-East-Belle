const jwt = require("jsonwebtoken");
const HTTPErrors = require("./HTTPErrors");

function setTkn(req, res) {
    const { name } = req.body;
    const type = req.type;
    const data = {[`${type}`] : name};

    const acessToken = jwt.sign({ name, type }, process.env.secretKey, { expiresIn: "30m" });
    const refreshToken = jwt.sign({ name, type }, process.env.secretKey, { expiresIn: "3d" });

    setTknCookies(res, acessToken, refreshToken);
    res.json(data);
}

function setTknCookies(res, acessToken, refreshToken) {
    const fifteenMinutes = 1000 * 60 * 15;
    const threeDays = 1000 * 60 * 60 * 24 * 3;

    setCookie(res, { label: "acessToken", value: acessToken }, fifteenMinutes);
    setCookie(res, { label: "refreshToken", value: refreshToken }, threeDays);
}


function setCookie(res, tkn, timeInMinutes) {
    // Define o cookie, com propriedades seguras, para o front-end não ser capaz de acessá-los
    res.cookie(tkn.label, tkn.value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: timeInMinutes,
        path: "/"
    });
}

function getTkn(req, res) {
    const cookies = getCookie(req);

    const { refreshToken } = cookies;
    let { acessToken } = cookies;

    if (!acessToken && refreshToken) {
        acessToken = refreshTkn(refreshToken, res);
    }

    let returnTkn = "";
    jwt.verify(acessToken, process.env.secretKey, function (err, user) {
        if (err) {
            throw new HTTPErrors("Acesso NÃO autorizado", 403);
            // return res.status(403).json({ error: "Acesso NÃO autorizado" })
        };

        returnTkn = user;
    })

    return returnTkn;
}

// Função para pegar os cookies
function getCookie(req) {
    const cookiesOriginal = req.headers.cookie;
    const cookies = {};

    if (!cookiesOriginal) throw new HTTPErrors("Faça login em sua conta primeiro", 401);

    cookiesOriginal.split(";").forEach(function (item) {
        const [key, value] = item.trim().split("=");
        cookies[key] = value;
    })

    return cookies;
}

function refreshTkn(refreshToken, res) {
    let resultTkn = null;

    jwt.verify(refreshToken, process.env.secretKey, function (err, user) {
        if (err) {
            throw new HTTPErrors("Sua sessão expirou", 403);
            // res.status(403).json({ error: "Sua sessão expirou" }); // Manda um aviso caso dê erro
        }

        const newAcessToken = jwt.sign({ name: user.name, type: user.type }, process.env.secretKey, { expiresIn: "30m" });
        const newRefreshToken = jwt.sign({ name: user.name, type: user.type }, process.env.secretKey, { expiresIn: "3d" });

        setTknCookies(res, newAcessToken, newRefreshToken);

        resultTkn = newAcessToken;
    })

    return resultTkn;
}

// // Adiciona o refreshToken e o AcessToken a cookies
// function setCookie(res, refresh, acess) {
//     const expiresRefreshtoken = 60 * 60 * 24 * 3; // Tempo para o cookie do Refreshtoken expirar
//     const expiresAcessToken = 60 * 30; // Tempo para o cookie do Acesstoken expirar
//
//     // Define cada cookie, com propriedades seguras, para o front-end não ser capaz de acessá-los
//     res.setHeader("Set-Cookie",
//         [
//             `refreshToken=${refresh}; ` +
//             "HttpOnly; " +
//             "Secure; " +
//             "SameSite=strict; " +
//             `Max-Age=${expiresRefreshtoken};` +
//             "path=/",
//
//             `acessToken=${acess}; ` +
//             "HttpOnly; " +
//             "Secure; " +
//             "SameSite=strict; " +
//             `Max-Age=${expiresAcessToken};` +
//             "path=/",
//         ]

module.exports = { setTkn, getTkn };
