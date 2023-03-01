const { User } = require("../../models");
const fs = require("fs");
const { Buffer } = require('buffer');

const updateAvatar = async (req, res) => {
    const { path: tempUpload } = req.file;
    const img = fs.readFileSync(tempUpload, 'base64');
    const final_img = {
        contentType: req.file.mimetype,
        image: Buffer.from(img, 'base64')
    };
    const avatarURL = 'data:image/png;base64,' + Buffer.from(final_img.image).toString('base64');
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    try {
        fs.unlinkSync(tempUpload);
        res.json({ avatarURL }); //? for Kapu$ta
    } catch (error) {
        fs.unlinkSync(tempUpload);
        throw error;
    }
};
module.exports = updateAvatar;