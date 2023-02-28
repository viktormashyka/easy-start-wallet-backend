const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");


//-----------------------------------------------------------------------------
const updateBalance = async (req, res) => {
    const { id: userId } = req.user
    const { balance: balanceUpdate } = req.body //?

    //! Находим user по его _id:
    const user = await User.findOne({ _id: userId });

    //! ОШИБКА Unauthorized - если нет такого user
    if (!user) {
        throw new Unauthorized("Not authorized");
    };

    //! ЗАПИСЬ нового значения balance в user
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { balance: Number(balanceUpdate) }, { new: true });

    //! Получаем поле balance 
    const { balance } = userUpdate;

    res.status(200).json({ balance })
};

module.exports = updateBalance
