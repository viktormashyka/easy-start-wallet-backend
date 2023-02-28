const { NotFound, BadRequest } = require('http-errors');
const { User } = require("../../models");

const { lineBreak } = require("../../services");


//-----------------------------------------------------------------------------
const verifyEmail = async (req, res, next) => {
    console.log(""); //!

    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
        //! ===========================console============================
        console.log("Нет ПОЛЬЗОВАТЕЛЯ с таким verificationToken:".yellow, verificationToken.red); //!
        lineBreak();
        // console.log("END-->PATCH/:id/subscription".rainbow); //!
        //! ==============================================================
        throw new NotFound(`User not found`)
    };

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    //! ===========================console============================
    console.log("verifyEmail-->user:".bgYellow.red); //?
    console.log(user);
    lineBreak();
    //! ==============================================================

    //! Мой вариант
    // res.status(200).json({
    //     message: "Verification successful",
    //     status: "success",
    //     code: 200,
    //     data: { user },
    // });

    //! Как в ДЗ-6
    res.json({
        message: "Verification successful",
        status: "success",
        code: 200,
        data: { user }
    });
};

module.exports = verifyEmail;