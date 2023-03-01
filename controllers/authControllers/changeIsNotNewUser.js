const { NotFound, BadRequest } = require('http-errors');
const { User } = require("../../models");

const changeIsNotNewUser = async (req, res, next) => {
    const { id: userId } = req.user
    const { isNotNewUser: changeIsNotNewUser } = req.body
    if (!changeIsNotNewUser) {
        throw new BadRequest("missing field isNotNewUser")
    };
    const user = await User.findOneAndUpdate({ _id: userId }, { isNotNewUser: true }, { new: true });
    if (!user) {
        throw new NotFound(`Contact wiht id:'${userId}' not found`)
    }
    const { isNotNewUser } = user;
    res.status(200).json({ isNotNewUser })
};
module.exports = changeIsNotNewUser;