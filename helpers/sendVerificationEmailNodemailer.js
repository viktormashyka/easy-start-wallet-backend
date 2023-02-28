const nodemailer = require("nodemailer");
require("dotenv").config();
const { META_EMAIL, META_PASSWORD } = process.env;


//-----------------------------------------------------------------------------
//! Объект конфигурации META:
const nodemalierConfig = {
    host: "smtp.meta.ua",
    port: 465, // 25, 465, 2255
    secure: true,
    auth: {
        user: META_EMAIL,
        pass: META_PASSWORD,
    }
};

const transporter = nodemailer.createTransport(nodemalierConfig);


const sendVerificationEmailNodemailer = async (data) => {
    try {
        const dataNodemailer = { ...data, from: META_EMAIL };

        const info = await transporter.sendMail(dataNodemailer);
        console.log("");
        console.log("info:".bgCyan.black, info);
        console.log("");
        console.log("Email send using Nodemailer success!".bgCyan.black);
        console.log("");
        return true;

    } catch (error) {
        throw error;
    }
};

module.exports = sendVerificationEmailNodemailer

