const { Transaction } = require("../../models");
const { User } = require("../../models");
const { NotFound } = require('http-errors')

//-----------------------------------------------------------------------------
const removeTransaction = async (req, res, next) => {
    const { transactionId } = req.params;
    const { id: userId } = req.user //?

    //! Удаляем ТРАНЗАКЦИЮ
    const transaction = await Transaction.findOneAndRemove({ _id: transactionId, owner: userId });

    if (!transaction) {
        throw new NotFound(`Transaction wiht id:'${transactionId}' not found`)
    }

    //! Находим СУММУ  для именения БАЛАНСА
    const sum = transaction.sum

    //! Находим значение balance у user
    const user = await User.findOne({ _id: userId });
    const { balance } = user


    //! Проверка на СУММИРОВАТЬ/Expenses или ВЫЧИТАТЬ/Income
    let balanceUpdate = 0
    if (transaction.transactionsType === "expenses") {
        balanceUpdate = balance + transaction.sum
    } else {
        balanceUpdate = balance - transaction.sum
    }

    //! ЗАПИСЬ нового значения balance в user
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { balance: Number(balanceUpdate) }, { new: true });

    //! как вариант дублирования user.balance (пока не надо)
    const { balance: balanceNew } = userUpdate;

    res.status(200).json({ transactionId, balanceNew });
};

module.exports = removeTransaction;