const express = require('express');
const router = express.Router();

const {
  validation,
  controllerWrapper,
  isValidId,
  authMiddleware,
} = require('../../middlewares');

const { transactionsControllers: ctrl } = require('../../controllers');

const {
  transactionJoiSchemaPost,
} = require('../../models/transactionModel.js');

const validateMiddlewarePost = validation(transactionJoiSchemaPost);

//-----------------------------------------------------------------------------
//! 1. Получение ВСЕХ ТРАНЗАКЦИЙ ПОЛЬЗОВАТЕЛЯ
router.get('/', authMiddleware, controllerWrapper(ctrl.getAllTransactions));

//! 2. Создание НОВОЙ ТРАНЗАКЦИИ Expenses или INCOME
router.post(
  '/',
  authMiddleware,
  validateMiddlewarePost,
  controllerWrapper(ctrl.addTransaction)
);

//! 3. Удаление ОДНОЙ ТРАНЗАКЦИИ Expenses или INCOME по id
router.delete(
  '/:transactionId',
  authMiddleware,
  isValidId,
  controllerWrapper(ctrl.removeTransaction)
);

//! 4. Получение ВСЕХ ТРАНЗАКЦИЙ НА СТРАНИЦЕ REPORT
router.get(
  '/report',
  authMiddleware,
  controllerWrapper(ctrl.getAllTransactionsReport)
);

module.exports = router;
