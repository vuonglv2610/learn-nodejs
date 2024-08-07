const nodemailer = require("nodemailer");
require('dotenv').config();

module.exports = {
    sendEmailService: async (email) => {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_NODE_MAILER,
                pass: process.env.PASSWORD_NODE_MAILER,
            },
        });
        await transporter.sendMail({
            from: `"Vuong test send mail 👻" <${process.env.USER_NODE_MAILER}>`,
            to: email,
            subject: "Thanks you for everything",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });
    }
}
