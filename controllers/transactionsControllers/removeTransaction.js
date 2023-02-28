const { Transaction } = require("../../models");
const { User } = require("../../models");
const { NotFound } = require('http-errors')

const { lineBreak } = require("../../services");


//-----------------------------------------------------------------------------
const removeTransaction = async (req, res, next) => {
    const { transactionId } = req.params;
    // const contact = await Contact.findByIdAndRemove(transactionId);

    const { id: userId } = req.user //?

    //* =============================console===================================
    console.log("removeTransaction --> req.user:".bgYellow.red); //?
    // console.table(req.user); //?
    // console.table([req.user]);
    console.log(req.user);

    console.log("removeTransaction --> userId:".bgYellow.blue, userId); //?
    console.log("");
    //* =======================================================================


    //! ===========================console============================
    console.log("START-->DELETE/:id".red); //!
    lineBreak();
    //! ==============================================================

    //! Находим Удаляемую ТРАНЗАКЦИЮ по transactionId 
    // const transactionDel = await Transaction.findOne({ _id: transactionId });

    //! Удаляем ТРАНЗАКЦИЮ
    const transaction = await Transaction.findOneAndRemove({ _id: transactionId, owner: userId });


    if (!transaction) {
        //! ===========================console============================
        console.log("Нет ТРАНЗАКЦИИ с таким ID:".yellow, transactionId.red); //!
        lineBreak();
        console.log("END-->DELETE/:id".red); //!
        //! ==============================================================
        throw new NotFound(`Transaction wiht id:'${transactionId}' not found`)
    }


    //! ===========================console============================
    console.log(`Эта ТРАНЗАКЦИЯ с ID: ${transactionId} УДАЛЕНА:`.bgRed.yellow); //!
    console.log(transaction); //!
    lineBreak();
    console.log("END-->DELETE/:id".red); //!
    lineBreak();
    //! ==============================================================


    //! Находим СУММУ  для именения БАЛАНСА
    const sum = transaction.sum
    console.log(`СУММА  для именения БАЛАНСА: ${sum} UAN `.bgWhite.red); //!
    console.log();

    //! Находим значение balance у user
    const user = await User.findOne({ _id: userId });
    const { balance } = user
    console.log(`Старый Баланс пользователя с ID: ${userId} = ${balance} UAN `.bgBlue.red); //!
    console.log();

    let balanceUpdate = 0
    //! Проверка на СУММИРОВАТЬ/Expenses или ВЫЧИТАТЬ/Income
    if (transaction.transactionsType === "expenses") {
        balanceUpdate = balance + transaction.sum
    } else {
        balanceUpdate = balance - transaction.sum
    }

    //! ЗАПИСЬ нового значения balance в user
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { balance: Number(balanceUpdate) }, { new: true });

    //! как вариант дублирования user.balance (пока не надо)
    const { balance: balanceNew } = userUpdate;
    console.log(`Новый БАЛАНС пользователя с ID: ${userId} = ${balanceNew} UAN `.bgRed.white); //!
    console.log();

    //---------------------------------------------------------------------------
    //! Находим ДАТУ и вынимаем из нее ДЕНЬ, МЕСЯЦ, ГОД
    const date = transaction.date
    console.log("date:".yellow, date); //!
    console.log();

    const [day, month, year] = date.split("-");
    console.log("day:".yellow, day); //!
    console.log("month:".yellow, month); //!
    console.log("year:".yellow, year); //!
    console.log();
    //---------------------------------------------------------------------------



    res.status(200).json({ transactionId, balanceNew });

    //! OLD
    // res.status(200).json({
    //     status: "success",
    //     code: 204,
    //     message: `Transaction wiht id:'${transactionId}'was remove:`,
    //     data: { transaction }
    // });
};

module.exports = removeTransaction;