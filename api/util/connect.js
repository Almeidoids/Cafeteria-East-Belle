const mongoose = require("mongoose");

let isConnected = false // Função para saber se o banco já está conectado

// Função para conectar-se ao banco
async function connect(req, res, next) {    
    try {
        // Caso não esteja conectado ao banco
        if (!isConnected) {
            await mongoose.connect(process.env.mongoDB);
            isConnected = true; // Muda variavel isConnected para true, avisando que já está conectado
        }
        
        next(); // Chama a próxima função
    }
    // Se der erro
    catch (err) {
        next(err);
    };
}

module.exports = connect;