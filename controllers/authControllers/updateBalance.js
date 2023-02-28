const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");


//-----------------------------------------------------------------------------
const updateBalance = async (req, res) => {
    console.log(""); //!
    console.log("updateBalanceController ОБЪЕКТ -> req.body:".bgBlue.red, req.body); //!
    console.log(""); //!
    console.log("updateBalanceController ОБЪЕКТ -> req.user:".bgBlue.yellow, req.user); //!
    console.log(""); //!


    const { id: userId } = req.user

    const { balance: balanceUpdate } = req.body //?

    console.log("updateBalanceController --> userId:".bgBlue.red, userId.red); //!
    console.log("updateBalanceController --> updateBalance:".bgBlue.yellow, balanceUpdate); //!
    console.log("typeof balanceUpdate:".yellow, (typeof Number(balanceUpdate)).red); //!

    //! Находим user по его _id:
    const user = await User.findOne({ _id: userId });

    //! ОШИБКА Unauthorized - если нет такого user
    if (!user) {
        throw new Unauthorized("Not authorized");
    };

    //! ЗАПИСЬ нового значения balance в user
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { balance: Number(balanceUpdate) }, { new: true });

    console.log(""); //!
    console.log("updateBalanceController --> userUpdate:".bgBlue.yellow, userUpdate); //!
    console.log(""); //!


    //! Получаем поле balance 
    const { balance } = userUpdate;

    res.status(200).json({ balance })
};


module.exports = updateBalance
