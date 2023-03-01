const express = require('express');
const router = express.Router();

const {
  validation,
  controllerWrapper,
  authMiddleware,
  uploadMiddleware,
  resizeXandYbyJimpMiddleware,
  passport,
} = require('../../middlewares');

const { authControllers: ctrl } = require('../../controllers');

const {
  registerJoiSchema,
  loginJoiSchema,
} = require('../../models/userModel.js');

const validateMiddlewareRegister = validation(registerJoiSchema);
const validateMiddlewarelogin = validation(loginJoiSchema);


//-----------------------------------------------------------------------------
//! 0. Google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  controllerWrapper(ctrl.googleAuth)
);

//! 1. Регистрация
router.post(
  '/signup',
  validateMiddlewareRegister,
  controllerWrapper(ctrl.registrationController)
);

//! 2. Login
router.post(
  '/login',
  validateMiddlewarelogin,
  controllerWrapper(ctrl.loginController)
);

//! 3. Logout
router.get('/logout', authMiddleware, controllerWrapper(ctrl.logoutController));

//! 4. Текущий пользователь - получить данные юзера по токену
router.get(
  '/current',
  authMiddleware,
  controllerWrapper(ctrl.getCurrentController)
);

//! 5. Обновление аватарки (avatarURL) пользователя
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  resizeXandYbyJimpMiddleware,
  controllerWrapper(ctrl.updateAvatar)
);

//! 6. ПОЛУЧИТЬ баланс пользователя
router.get('/balance', authMiddleware, controllerWrapper(ctrl.getBalance));

//! 7. ИЗМЕНИТЬ баланс пользователя
router.patch('/balance', authMiddleware, controllerWrapper(ctrl.updateBalance));

//! 8. ИЗМЕНИТЬ статус  пользователя --> user.isNewUser: false (если balanceNew === 0)
router.patch(
  '/isnotnewuser',
  authMiddleware,
  controllerWrapper(ctrl.changeIsNotNewUser)
);

module.exports = router;
