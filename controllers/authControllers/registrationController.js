const { User } = require('../../models/userModel.js');
const { Conflict } = require('http-errors');

const bcrypt = require('bcryptjs');
//* gravatar
const gravatar = require('gravatar');

const { nanoid } = require('nanoid');

//? ----------------------- SendGrid -----------------------
// const sgMail = require('@sendgrid/mail');
// require("dotenv").config();
// const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;
// sgMail.setApiKey(SENDGRID_API_KEY);
// // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { sendVerificationEmailSendGrid } = require('../../helpers');
//? _______________________ SendGrid _______________________

//todo ------------------- Nodemailer -------------------
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const { META_EMAIL, META_PASSWORD } = process.env;

const { sendVerificationEmailNodemailer } = require('../../helpers');
//todo ___________________ Nodemailer ____________________

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { lineBreak } = require('../../services');

//-----------------------------------------------------------------------------
const registrationController = async (req, res) => {
  const { name, email, password } = req.body;
  const userMailCheck = await User.findOne({ email });

  //! ПРОВЕРКА - если email уже используется кем-то другим:
  if (userMailCheck) {
    throw new Conflict(`Email ${email} in use`);
  }

  //! ------------------------ Хеширование и засолка password --------------------------
  //? 1-вариант
  //! Пароль в явном виде (если не используется хеширование и засолка в userSchema (1 вариант))
  // const newUser = await User.create({ email, password });

  //? 2-вариант (самый простой)
  //!  Хеширование и засолка password с помошью bcryptjs (или bcrypt)
  // const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  // const newUser = await User.create({ email, password: hashPassword });

  //* gravatar
  // const avatarURL = gravatar.url(email);
  // const avatarURL = gravatar.url(email, { protocol: 'https', d: 'retro' });
  // const avatarURL = gravatar.url(email, { protocol: 'https', s: '32', d: 'retro' });
  const avatarURL = gravatar.url(email, { protocol: 'https', d: 'robohash' });

  //? ------------------- SendGrid -------------------
  //todo ------------------- Nodemailer -------------------
  // const verificationToken = nanoid();
  const verificationToken = null; //? Заглушка для Kapu$ta
  console.log('');
  console.log('verificationToken:'.bgRed.white, verificationToken); //!

  //? 3-вариант (самый сложный)
  //!  Хеширование и засока password с помошью bcryptjs (или bcrypt) используется в userSchema
  const newUser = new User({ name, email, avatarURL, verificationToken }); //* gravatar + SendGrid or Nodemailer
  await newUser.setPassword(password);
  await newUser.save();
  //! _______________________ Хеширование и засолка password _________________________

  const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET);
  newUser.token = token;
  await newUser.save();
  console.log('\nnewUser:'.green, newUser); //!
  console.log('');

  //? Для Kapu$ta - НЕ ИСПОЛЬЗУЕТСЯ
  //? ------------------ SendGrid -------------------
  //todo -------------- Nodemailer ------------------
  //! Отправка письма
  const mail = {
    to: email,
    // from: META_EMAIL, //? Use the email address or domain you verified above
    // from: SENDGRID_EMAIL, //? Use the email address or domain you verified above
    subject: 'Подтверждение регистрации вашего EMAIL на сайте Contacts BOOK',
    // text: '...and easy to do anywhere, even with Node.js and Nodemailer',
    // html: `<a href = "http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Нажмите для подтверждения вашего EMAIL</a>`,
    html: `<a href = "https://contact-book-backend52.onrender.com/api/users/verify/${verificationToken}" target="_blank">Нажмите для подтверждения вашего EMAIL</a>`,
  };

  //? Для Kapu$ta - SendGrid --> ОТКЛЮЧЕНО
  //? ------------------ SendGrid -------------------
  // await sendVerificationEmailSendGrid(mail); //! отправка подтверждениия (верификации) на email пользователя

  //todo -------------- Nodemailer ------------------
  // await sendVerificationEmailNodemailer(mail); //! отправка подтверждениия (верификации) на email пользователя

  //? Для Kapu$ta - Создаем ТОКЕН --> ОТКЛЮЧЕНО
  // //! +++++++++++++++++++++++++++++++++ Создаем ТОКЕН ++++++++++++++++++++++++++++++++++++
  // const payload = { id: newUser._id };

  // const token = jwt.sign(payload, JWT_SECRET);
  // // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); //! Временный - 1 час

  // // user.token = token
  // //! Обновляем поле "token" в MongoDB --> db-contacts.users
  // const user = await User.findByIdAndUpdate(newUser._id, { token }, { new: true });

  // console.log("\nuser:".yellow, user); //!
  // console.log("token:".red, token.green); //!
  // console.log("");
  // //! ___________________________________ Создаем ТОКЕН ___________________________________

  res.status(201).json({
    // status: "success",
    code: 201,
    // user, //? НЕ НАДО для Kapu$ta:
    // token, //? НЕ НАДО для Kapu$ta:
    newUser,

    // userNew: {
    //     email,
    //     subscription: newUser.subscription,
    //     avatarURL, //* gravatar
    token,
    // },
  });
};

module.exports = registrationController;
