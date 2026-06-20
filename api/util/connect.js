const mongoose = require("mongoose");

let isConnected = false // Função para saber se o banco já está conectado

// Função para conectar-se ao banco
async function connect(req, res, next) {
    console.log("ponto")
    await req.body; // Espera o req.body
    
    try {
        // Caso não esteja conectado ao banco
        if (!isConnected) {
            await mongoose.connect(process.env.mongoDB);
            isConnected = true; // Muda variavel isConnected para true, avisando que já está conectado
        }
        
        console.log("Conectado ao banco");
        next(); // Chama a próxima função
    }
    // Se der erro
    catch (err) {
        console.log(err);
        res.status(500).json({error: `Erro ao conectar ao banco`}) // Retorna resposta com erro
    };
}

module.exports = connect;