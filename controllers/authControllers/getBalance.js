const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");


//-----------------------------------------------------------------------------
const getBalance = async (req, res) => {
    const { id: userId } = req.user
    const user = await User.findOne({ _id: userId });

    //! ОШИБКА Unauthorized - если нет такого user
    if (!user) {
        throw new Unauthorized("Not authorized");
    };

    //! Получаем поле balance и isNotNewUser
    const { balance, isNotNewUser } = user;

    res.status(200).json({ balance, isNotNewUser })
};

module.exports = getBalance
