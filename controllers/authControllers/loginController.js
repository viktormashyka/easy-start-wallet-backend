// require("colors");
const { User } = require('../../models/userModel.js');
const { Unauthorized, BadRequest } = require('http-errors');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { lineBreak } = require('../../services');

//-----------------------------------------------------------------------------
const loginController = async (req, res) => {
  const { email, password } = req.body;

  console.log('email:'.bgCyan.black, email.cyan); //!
  console.log('');
  console.log('password:'.bgCyan.black, password.cyan); //!
  console.log('');
  console.log('User:'.bgCyan.black, User); //!
  console.log('');

  let user = await User.findOne({ email });

  console.log('user:'.bgCyan.black, user); //!

  //! ОШИБКА Unauthorized - если пароль или email неверный
  //? 1-вариант (разнные соообщения об ошибках email или password)
  // if (!user) {
  //     throw new Unauthorized("Email is wrong");
  // }

  // const passCompare = bcrypt.compareSync(password, user.password);
  // if (!passCompare) {
  //     throw new Unauthorized("Password is wrong");
  // }

  //? 2-вариант (с использованием метода "Сравнение паролей" в userSchema)
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong');
  }

  //! Проверка пользователя на верификацию его email
  if (!user.verify) {
    //! ===========================console============================
    console.log(
      'ПОЛЬЗОВАТЕЛЬ с таким email: '.bgYellow.black,
      email.cyan,
      ' НЕ верифицирован!'.bgYellow.black
    ); //!
    lineBreak();
    //! ==============================================================
    throw new Unauthorized(`Email not verified`);
  }

  //! Создаем ТОКЕН
  const payload = { id: user._id, email: user.email };

  const token = jwt.sign(payload, JWT_SECRET);
  // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); //! Временный - 1 час

  // user.token = token
  //! Обновляем поле "token" в MongoDB --> db-contacts.users
  user = await User.findByIdAndUpdate(user._id, { token }, { new: true });

  console.log('\nuser:'.yellow, user); //!
  console.log('token:'.red, token.green); //!
  console.log('');

  res.status(200).json({
    // status: "success",
    code: 200,
    user,
    token,
    // data: {
    //     token,
    //     user: {
    //         email,
    //         subscription: user.subscription
    //     }
    // }
  });
};

module.exports = loginController;
