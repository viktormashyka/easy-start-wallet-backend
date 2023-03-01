const { User } = require('../../models/userModel.js');
const { Unauthorized } = require('http-errors');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const loginController = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong');
  }
  if (!user.verify) {
    throw new Unauthorized(`Email not verified`);
  }
  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET);
  user = await User.findByIdAndUpdate(user._id, { token }, { new: true });
  res.status(200).json({
    user,
    token,
  });
};
module.exports = loginController;
