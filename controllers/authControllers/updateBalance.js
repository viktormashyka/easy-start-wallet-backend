const { User } = require("../../models/userModel.js");
const { Unauthorized } = require("http-errors");

const updateBalance = async (req, res) => {
    const { id: userId } = req.user
    const { balance: balanceUpdate } = req.body //?
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new Unauthorized("Not authorized");
    };
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { balance: Number(balanceUpdate) }, { new: true });
    const { balance } = userUpdate;
    res.status(200).json({ balance })
};
module.exports = updateBalance
