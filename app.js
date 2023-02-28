const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
require('colors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRouter = require('./routes/api/authRouter.js');
const transactionsRouter = require('./routes/api/transactionsRouter.js');

//----------------------------------------------------------------
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger));

// app.use(logger("dev")) //! нужно для деплоя (НЕ УДАЛЯТЬ)
app.use(cors());
app.use(express.json());
app.use(express.static('public')); //! Чтобы Express мог раздавать статические файлы из папки "/public"

//!++++++++++++++++++++++++++ static ++++++++++++++++++++++++++++++
app.use('/public', express.static('public'));
//!++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use('/api/users', authRouter);
app.use('/api/transactions', transactionsRouter);

//!++++++++++++++++++++++++++ swagger ++++++++++++++++++++++++++++++
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//!+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use((req, res) => {
  console.log('!!! ОШИБКА !!!:'.bgRed.white); //!
  console.log('Такой маршрут не найден...'.bgYellow.red); //!
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server ERROR' } = err;
  //! ===========================console============================
  console.log('!!! ОШИБКА !!!:'.bgRed.white);
  console.error(err.message.red);
  console.log('');
  //! ==============================================================
  res.status(status).json({ message: err.message });
});

module.exports = app;
