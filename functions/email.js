const nodemailer = require("nodemailer");

function mail(name, lastName, email) {
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        
        auth: {
            user: "cafeteriaeastbelle@gmail.com",
            pass: "tihaucoqmwjcifjd",
        }
    });

    transport.sendMail({
        from: "Cafeteria East Belle <cafeteriaeastbelle@gmail.com>",
        to: email,
        subject: "Obrigado por fazer sua pergunta",
        html: `<p>Obrigado por fazer sua pergunta ${name} ${lastName}, Infelizmente não existimos, então não podemos reponder...</p>`,
        text: `Obrigado por fazer sua pergunta ${name} ${lastName}, mas infelizmente não existimos, então não poderemos responder :-/`
    })
    .then(() => {console.log("Email enviado")})
    .catch((err) => console.log("Erro ao enviar email" + err));
}