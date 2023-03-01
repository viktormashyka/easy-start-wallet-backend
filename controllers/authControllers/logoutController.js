const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");


//-----------------------------------------------------------------------------
const logoutController = async (req, res) => {
    const { id: userId } = req.user

    let user = await User.findById({ _id: userId }); //! 2-вариант

    //! ОШИБКА Unauthorized - если нет такого user
    if (!user) {
        throw new Unauthorized("Not authorized");
    }

    //! Удаление токена
    user.token = null

    //! Обновляем поле "token" в MongoDB --> db-contacts.users
    user = await User.findByIdAndUpdate(user._id, { token: null }, { new: true });

    res.status(200).json({ user })
};

module.exports = logoutController