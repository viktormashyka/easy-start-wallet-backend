const { User } = require('../../models/userModel.js');
const { Conflict } = require('http-errors');

const gravatar = require('gravatar');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;


//-----------------------------------------------------------------------------
const registrationController = async (req, res) => {
  const { name, email, password } = req.body;
  const userMailCheck = await User.findOne({ email });

  //! ПРОВЕРКА - если email уже используется кем-то другим:
  if (userMailCheck) {
    throw new Conflict(`Email ${email} in use`);
  }

  const avatarURL = gravatar.url(email, { protocol: 'https', d: 'robohash' });


  //todo ------------------- SendGrid or Nodemailer -------------------
  const verificationToken = null; //? Заглушка для Kapu$ta

  //!  Хеширование и засока password с помошью bcryptjs (или bcrypt) используется в userSchema
  const newUser = new User({ name, email, avatarURL, verificationToken }); //* gravatar + SendGrid or Nodemailer
  await newUser.setPassword(password);
  await newUser.save();
  //! _______________________ Хеширование и засолка password _________________________

  const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET);
  newUser.token = token;
  await newUser.save();


  res.status(201).json({
    newUser,
    token,
  });
};

module.exports = registrationController;
