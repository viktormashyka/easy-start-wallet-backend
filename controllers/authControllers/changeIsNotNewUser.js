const { NotFound, BadRequest } = require('http-errors');
const { User } = require("../../models");

const { lineBreak } = require("../../services");


//-----------------------------------------------------------------------------
const changeIsNotNewUser = async (req, res, next) => {
    console.log(""); //!

    const { id: userId, isNotNewUser: oldIsNotNewUser } = req.user

    console.log("changeIsNotNewUser --> userId:".bgBlue.yellow, userId); //!
    console.log("changeIsNotNewUser --> oldIsNotNewUser:".bgBlue.yellow, oldIsNotNewUser); //!

    const { isNotNewUser: changeIsNotNewUser } = req.body

    console.log("changeIsNotNewUser --> changeIsNotNewUser:".bgBlue.red, changeIsNotNewUser); //!


    //! Проверка условия "Если body нет" 
    if (!changeIsNotNewUser) {
        throw new BadRequest("missing field isNotNewUser")
    }

    //* =============================console===================================
    console.log("changeIsNotNewUser --> req.user:".bgYellow.red); //?
    // console.table(req.user); //?
    // console.table([req.user]);
    console.log(req.user);

    console.log("changeIsNotNewUser --> changeIsNotNewUser:".bgYellow.blue, changeIsNotNewUser); //?
    console.log("");
    //* =======================================================================


    //! ===========================console============================
    console.log("START-->PATCH/isnotnewuser".rainbow); //!
    lineBreak();
    //! ==============================================================

    const user = await User.findOneAndUpdate({ _id: userId }, { isNotNewUser: true }, { new: true });


    if (!user) {
        //! ===========================console============================
        console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким ID:".yellow, userId.red); //!
        lineBreak();
        console.log("END-->PATCH/isnotnewuser".rainbow); //!
        //! ==============================================================
        throw new NotFound(`Contact wiht id:'${userId}' not found`)
    }

    //! ===========================console============================
    console.log(`ОБНОВЛЕННЫЙ ПОЛЬЗОВАТЕЛЬ с ID: ${userId}:`.rainbow); //!
    console.log(user); //!
    lineBreak();
    console.log("END-->PATCH/isnotnewuser".rainbow); //!
    lineBreak();
    //! ==============================================================

    //! Получаем поле balance 
    const { isNotNewUser } = user;


    res.status(200).json({ isNotNewUser })

    // res.status(200).json({
    //     status: "success",
    //     code: 200,
    //     data: { user }
    // })
};

module.exports = changeIsNotNewUser;