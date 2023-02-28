const registrationController = require('./registrationController.js');
const loginController = require('./loginController.js');
const logoutController = require('./logoutController');
const getCurrentController = require('./getCurrentController');
const updatePatchUserSubscription = require('./updatePatchUserSubscription');
const updateAvatar = require('./updateAvatar');
const verifyEmail = require('./verifyEmail');
const resendVerifyEmail = require('./resendVerifyEmail');
const getBalance = require('./getBalance');
const updateBalance = require('./updateBalance');
const changeIsNotNewUser = require('./changeIsNotNewUser');
const googleAuth = require('./googleAuth');

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentController,
  updatePatchUserSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
  getBalance,
  updateBalance,
  changeIsNotNewUser,
  googleAuth,
};
