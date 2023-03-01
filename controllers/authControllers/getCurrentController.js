const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");

const getCurrentController = async (req, res) => {
    const { id: userId } = req.user
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new Unauthorized("Not authorized");
    }
    res.status(200).json({ user })
};
module.exports = getCurrentController
