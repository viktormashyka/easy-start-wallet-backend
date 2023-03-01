const { Transaction } = require('../../models');
const { User } = require('../../models');

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
  const user = await User.findOne({ _id: userId });
  const { balance } = user;
  let balanceUpdate = 0;
  if (transaction.transactionsType === 'expenses') {
    balanceUpdate = balance - transaction.sum;
  } else {
    balanceUpdate = balance + transaction.sum;
  }
  const userUpdate = await User.findByIdAndUpdate(
    req.user._id,
    { balance: Number(balanceUpdate) },
    { new: true }
  );
  const { balance: balanceNew } = userUpdate;
  res.status(201).json({
    transaction,
    balanceNew,
  });
};
module.exports = addTransaction;
