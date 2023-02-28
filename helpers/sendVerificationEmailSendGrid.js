const sgMail = require('@sendgrid/mail');
require("dotenv").config();
const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);



//-----------------------------------------------------------------------------
const sendVerificationEmailSendGrid = async (data) => {
    try {
        const msg = { ...data, from: SENDGRID_EMAIL }
        const info = await sgMail.send(msg);
        console.log("");
        console.log("info:".bgCyan.black, info);
        console.log("");
        console.log("Email send using SendGrid success!".bgGreen.black);
        console.log("");
        return true;

    } catch (error) {
        throw error;
    }
};

module.exports = sendVerificationEmailSendGrid

