const { User } = require('../../models/userModel.js');
const { Unauthorized } = require('http-errors');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;


//-----------------------------------------------------------------------------
const loginController = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  //! "Сравнение паролей" в userSchema
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong');
  }

  //! Проверка пользователя на верификацию его email
  if (!user.verify) {
    throw new Unauthorized(`Email not verified`);
  }

  //! Создаем ТОКЕН
  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET);

  //! Обновляем поле "token" в MongoDB --> db-contacts.users
  user = await User.findByIdAndUpdate(user._id, { token }, { new: true });

  res.status(200).json({
    user,
    token,
  });
};

module.exports = loginController;
