const { Transaction } = require('../../models');


//-----------------------------------------------------------------------------
const getAllTransactions = async (req, res) => {
  const { id: userId } = req.user;

  const transactions = await Transaction.find({ owner: userId })
    .sort({ date: 1 }) //! сортировка по полю "date"
    .select({ owner: 0, updatedAt: 0 }); //! не показывать эти поля

  res.status(200).json({ transactions });
};

module.exports = getAllTransactions;
