const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");


//-----------------------------------------------------------------------------
const getBalance = async (req, res) => {
    console.log(""); //!
    // console.table([req.user]); //!
    console.log("getBalanceController ОБЪЕКТ -> req.user:".bgBlue.yellow, req.user); //!
    console.log(""); //!
    console.log("getBalanceController --> req.user._id:".bgBlue.yellow, req.user._id);
    console.log(""); //!

    const { id: userId } = req.user

    console.log("getBalanceController --> userId:".bgBlue.yellow, userId.red); //!
    const user = await User.findOne({ _id: userId });
    // const user = await User.findOne({ _id: "63af43c0e58a51e95a2c9ffe" }); //! Проверка на ОШИБКУ Unauthorized 
    console.log(""); //!
    console.log("getBalanceController --> user:".bgBlue.yellow, user); //!
    console.log(""); //!

    //! ОШИБКА Unauthorized - если нет такого user
    if (!user) {
        throw new Unauthorized("Not authorized");
    };

    //! Получаем поле balance и isNotNewUser
    const { balance, isNotNewUser } = user;

    res.status(200).json({ balance, isNotNewUser })
};


module.exports = getBalance
