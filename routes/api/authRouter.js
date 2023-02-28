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
  changeSubscriptionJoiSchema,
  verifyEmailJoiSchema,
} = require('../../models/userModel.js');

const validateMiddlewareRegister = validation(registerJoiSchema);
const validateMiddlewarelogin = validation(loginJoiSchema);
const validateMiddlewareChangeSubscription = validation(
  changeSubscriptionJoiSchema
);
const validateMiddlewareVerifyEmail = validation(verifyEmailJoiSchema);

//-----------------------------------------------------------------------------
//! Google

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

//! 5. Обновление подписки (subscription) пользователя
router.patch(
  '/',
  authMiddleware,
  validateMiddlewareChangeSubscription,
  controllerWrapper(ctrl.updatePatchUserSubscription)
); //! 2-вариант

//! 6. Обновление аватарки (avatarURL) пользователя
//!    PATCH -- > api/users/avatars
router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  resizeXandYbyJimpMiddleware,
  controllerWrapper(ctrl.updateAvatar)
);

//! 7. Верификация email пользователя
//!    GET -- > api/users/verify/:verificationToken
router.get('/verify/:verificationToken', controllerWrapper(ctrl.verifyEmail));

//! 8. Добавление повторной отправки email пользователю с ссылкой для верификации
//!    POST -- > api/users/verify
router.post(
  '/verify',
  validateMiddlewareVerifyEmail,
  controllerWrapper(ctrl.resendVerifyEmail)
);

//! 9. ПОЛУЧИТЬ баланс пользователя
router.get('/balance', authMiddleware, controllerWrapper(ctrl.getBalance));

//! 10. ИЗМЕНИТЬ баланс пользователя
router.patch('/balance', authMiddleware, controllerWrapper(ctrl.updateBalance));

//! 11. ИЗМЕНИТЬ статус  пользователя --> user.isNewUser: false (если balanceNew === 0)
router.patch(
  '/isnotnewuser',
  authMiddleware,
  controllerWrapper(ctrl.changeIsNotNewUser)
);

module.exports = router;
