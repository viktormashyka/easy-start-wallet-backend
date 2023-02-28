const { Transaction } = require('../../models');
const { User } = require('../../models');

const { Unauthorized } = require('http-errors');

const getAllTransactionsReport = async (req, res) => {
  const { month: theMonth = 1, year: theYear = 2023 } = req.query;

  let normalizedMonth = theMonth.toString().padStart(2, '0');

  let normalizedYear = theYear.toString();

  const { id: userId } = req.user;

  const user = await User.findOne({ _id: userId });
  const { balance } = user;

  const transactions = await Transaction.find({ owner: userId })
    .sort({ sum: -1 }) //! сортировка по полю "date"
    .select({ owner: 0, updatedAt: 0 }); //! не показывать эти поля

  const filterTransactions = transactions.filter(transaction => {
    const dateString = transaction.date;
    const [year, month, day] = dateString.split('-');

    if (month === normalizedMonth && year === normalizedYear) {
      return true;
    }

    return false;
  });

  res.status(200).json({ balance, filterTransactions });
};

module.exports = getAllTransactionsReport;
