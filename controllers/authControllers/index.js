const registrationController = require('./registrationController.js');
const loginController = require('./loginController.js');
const logoutController = require('./logoutController');
const getCurrentController = require('./getCurrentController');
const updateAvatar = require('./updateAvatar');
const getBalance = require('./getBalance');
const updateBalance = require('./updateBalance');
const changeIsNotNewUser = require('./changeIsNotNewUser');
const googleAuth = require('./googleAuth');

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentController,
  updateAvatar,
  getBalance,
  updateBalance,
  changeIsNotNewUser,
  googleAuth,
};
