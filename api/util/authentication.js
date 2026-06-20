const jwt = require("jsonwebtoken");

// Adiciona o refreshToken e o AcessToken a cookies
function setCookie(res, refresh, acess) {
    const expiresR = 60 * 60 * 24 * 3; // Tempo para o cookie do Refreshtoken expirar
    const expiresA = 60 * 30; // Tempo para o cookie do Acesstoken expirar

    // Define cada cookie, com propriedades seguras, para o front-end não ser capaz de acessá-los
    res.setHeader("Set-Cookie",
        [
            `refreshToken=${refresh}; ` +
            "HttpOnly; " +
            "Secure; " +
            "SameSite=strict; " +
            `Max-Age=${expiresR};` +
            "path=/",

            `acessToken=${acess}; ` +
            "HttpOnly; " +
            "Secure; " +
            "SameSite=strict; " +
            `Max-Age=${expiresA};` +
            "path=/",
        ]
    )
}

// Função para pegar os cookies
function getCookie(req) {
    const cookiesOriginal = req.headers.cookie; // Pega a string dos cookies do headers 
    const cookies = {}; // Objeto onde os cookies serão armazenados

    if (!cookiesOriginal) return null; // Se os cookies não existirem, retorna null

    // Transforma a string dos cookies em um objeto
    cookiesOriginal.split(";").forEach(function (item) { // Divide a string em um array e depois faz um forEach com todos os valores 
        const [key, value] = item.trim().split("="); // Armazena os pares chave e valor do cookie em duas variaveis: key e value
        cookies[key] = value;
    })

    return cookies; // Retorna o objeto
}

// Função para gerar o Token
function setTkn(req, res) {
    const { name } = req.body; // Pega o nome de usuario do body
    const type = req.type;
    console.log(type);
    const data = {};
    data[`${type}`] = name;
    console.log(name);

    const acessToken = jwt.sign({ name, type }, process.env.secretKey, { expiresIn: "30m" }); // Armazena o nome no AcessToken, que expirará em 30 minutos 
    const refreshToken = jwt.sign({ name, type }, process.env.secretKey, { expiresIn: "3d" }); // Armazena o nome no RefreshToken, que será usado para revalidar o AcessToken quando a sessão expirar. Expirará em 3 dias

    setCookie(res, refreshToken, acessToken); // Chama a função setCookie

    res.json(data); // entrega o nome do fornecedor como resposta da requisição
}

// Função para revalidar o acess token
function refreshTkn(refreshToken, res) {
    let naTkn = null;

    //  Verifica o refreshToken e faz uma função para caso seja validado ou dê erro
    jwt.verify(refreshToken, process.env.secretKey, function (err, user) {
        if (err) {
            res.status(403).json({ error: "Sua sessão expirou" }); // Manda um aviso caso dê erro
        }

        const newAcessToken = jwt.sign({ name: user.name, type: user.type }, process.env.secretKey, { expiresIn: "30m" }); // Define um novo Token de acesso
        const newRefreshToken = jwt.sign({ name: user.name, type: user.type }, process.env.secretKey, { expiresIn: "3d" }); // Define um novo Token para recarregar

        setCookie(res, newRefreshToken, newAcessToken); // coloca os dois no cookie

        naTkn = newAcessToken; // Retorna o novo Token de acesso
    })

    return naTkn;
}

function getTkn(req, res, next) {

    const cookies = getCookie(req); // Pega os cookie pela função getCookie

    if (!cookies) res.status(401).json({ error: "Faça login em sua conta primeiro" }); // Se cookies for nulo, dá erro    

    // Pega tanto refreshToken quanto o acessToken dos cookies
    const { refreshToken } = cookies;
    let { acessToken } = cookies;

    if (!acessToken && refreshToken) acessToken = refreshTkn(refreshToken, res); // Verifica se o token é válido, se não for, chama a função refreshToken para revalidar o acesssToken

    // Verifica o acessToken, e faz uma função para caso seja validado ou dê erro
    jwt.verify(acessToken, process.env.secretKey, function (err, user) {
        if (err) return res.status(403).json({ error: "Acesso NÃO autorizado" }); // Se der erro, retorna resposta
        
        req.user = user; // define req.user como o valor armazenado no jwt (user)
        console.log(user);
        next(); // Chama a próxima função da requisição
    })
}

module.exports = { setTkn, refreshTkn, getTkn };