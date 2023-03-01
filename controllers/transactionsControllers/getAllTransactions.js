const { Transaction } = require('../../models');

const getAllTransactions = async (req, res) => {
  const { id: userId } = req.user;
  const transactions = await Transaction.find({ owner: userId })
    .sort({ date: 1 })
    .select({ owner: 0, updatedAt: 0 });
  res.status(200).json({ transactions });
};
module.exports = getAllTransactions;
