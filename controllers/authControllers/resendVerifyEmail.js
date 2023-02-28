const { NotFound, BadRequest } = require('http-errors');
const { User } = require("../../models");

const {
    sendVerificationEmailSendGrid, //?  SendGrid
    sendVerificationEmailNodemailer //todo  Nodemailer 
} = require("../../helpers");


const { lineBreak } = require("../../services");


//-----------------------------------------------------------------------------
const resendVerifyEmail = async (req, res, next) => {
    console.log(""); //!

    const { email } = req.body;

    if (!email) {
        //! ===========================console============================
        console.log("Поле email являестя обязательным!!!".yellow); //!
        lineBreak();
        //! ==============================================================
        throw new NotFound(`Missing required field email`)
    };

    const user = await User.findOne({ email });

    if (!user) {
        //! ===========================console============================
        console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким email:".yellow, email.red); //!
        lineBreak();
        //! ==============================================================
        throw new NotFound(`User not found`)
    };

    if (user.verify) {
        //! ===========================console============================
        console.log("ПОЛЬЗОВАТЕЛЬ с таким email: ".bgYellow.black, email.bgWhite.red, " уже верифицирован!".bgYellow.black); //!
        lineBreak();
        //! ==============================================================
        throw new BadRequest(`Verification has already been passed`)
    };

    //? ------------------ SendGrid -------------------
    //todo -------------- Nodemailer ------------------
    //! Отправка письма
    const mail = {
        to: email,
        subject: "Подтверждение регистрации вашего EMAIL на сайте Contacts BOOK (повторное)",
        // html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}" target="_blank">Нажмите для повторного подтверждения вашего EMAIL</a>`
        html: `<a href="https://contact-book-backend52.onrender.com/api/users/verify/${user.verificationToken}" target="_blank">Нажмите для повторного подтверждения вашего EMAIL</a>`
    };

    //? ------------------- SendGrid -------------------
    await sendVerificationEmailSendGrid(mail); //! отправка повторного подтверждениия (верификации) на email пользователя

    //todo ---------------- Nodemailer ----------------
    // await sendVerificationEmailNodemailer(mail); //! отправка повторного подтверждениия (верификации) на email пользователя


    res.json({
        message: "Verification email sent",
        // status: "success",
        // code: 200,
        data: { user }
    });
};

module.exports = resendVerifyEmail;