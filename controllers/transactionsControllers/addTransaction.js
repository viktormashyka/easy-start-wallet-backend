const { Transaction } = require('../../models');
const { User } = require('../../models');


//-----------------------------------------------------------------------------
const addTransaction = async (req, res, next) => {
  const { id: userId } = req.user; //?

  const dateString = req.body.date;
  const [day, month, year] = dateString.split('.');
  const date = new Date(`${year}-${month}-${day}`);
  const isoString = date.toISOString();

  const transaction = await Transaction.create({
    ...req.body,
    date: isoString,
    owner: userId,
  });

  //! Находим значение balance у user
  const user = await User.findOne({ _id: userId });
  const { balance } = user;

  //! Проверка на ВЫЧИТАТЬ/Expenses или СУММИРОВАТЬ/Income
  let balanceUpdate = 0;
  if (transaction.transactionsType === 'expenses') {
    balanceUpdate = balance - transaction.sum;
  } else {
    balanceUpdate = balance + transaction.sum;
  }

  //! ЗАПИСЬ нового значения balance в user
  const userUpdate = await User.findByIdAndUpdate(
    req.user._id,
    { balance: Number(balanceUpdate) },
    { new: true }
  );

  //! как вариант дублирования user.balance (пока не надо)
  const { balance: balanceNew } = userUpdate;


  res.status(201).json({
    transaction,
    balanceNew, //! как вариант дублирования user.balance (пока не надо)
  });
};

module.exports = addTransaction;
