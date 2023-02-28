const { Transaction } = require('../../models');
const { User } = require('../../models');

const { Unauthorized } = require('http-errors');

const { lineBreak } = require('../../services');

//-----------------------------------------------------------------------------
const getAllTransactions = async (req, res) => {
  // const transactions = await Contact.Transaction({});

  console.log('getAllTransactions --> req.idUser:'.bgYellow.black, req.idUser); // это для ТЕСТА (в коде не нужно)
  const id = req.idUser; // это для ТЕСТА (в коде не нужно)
  console.log('getAllTransactions --> id=req.idUser:'.bgYellow.black, id); // это для ТЕСТА (в коде не нужно)
  lineBreak(); // это для ТЕСТА (в коде не нужно)

  const { id: userId } = req.user;

  //* =============================console===================================
  console.log('');
  console.log('getAllTransactions --> req.user:'.bgYellow.red);
  // console.table(req.user);
  // console.table([req.user]);
  console.log(req.user);

  console.log(
    'getAllTransactions --> userId:'.bgYellow.blue,
    userId.bgGreen.blue
  );
  console.log('');
  //* =======================================================================

  const transactions = await Transaction.find({ owner: userId })
    .sort({ date: -1 }) //! сортировка по полю "date"
    .select({ owner: 0, updatedAt: 0 }); //! не показывать эти поля

  //! ===========================console============================
  console.log('START-->GET/All'.green); //!
  lineBreak();
  console.log(
    'СОРТИРОВАННЫЙ СПИСОК ВСЕХ ТРАНЗАКЦИЙ (по полю <sum>) USER с id:'.bgGreen
      .black,
    userId.bgGreen.blue
  );

  console.log(transactions); //!!!!!

  lineBreak();
  console.log('END-->GET/All'.green); //!
  lineBreak();
  //! ==============================================================

  res.status(200).json({ transactions });
};

module.exports = getAllTransactions;
