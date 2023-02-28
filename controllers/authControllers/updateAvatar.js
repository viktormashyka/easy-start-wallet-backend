const { User } = require("../../models");
const path = require("path");
const fs = require("fs");

const { Buffer } = require('buffer'); //?


//--------------------------------------------------------------------------------------------
const updateAvatar = async (req, res) => {
    const { path: tempUpload } = req.file;


    //!  Запись файла АВАТАРКИ в mongoDB 
    const img = fs.readFileSync(tempUpload, 'base64');

    const final_img = {
        contentType: req.file.mimetype,
        image: Buffer.from(img, 'base64')
    };

    //! Получение АБСОЛЮТНОЙ ссылки avatarURL на файл АВАТАРКИ
    const avatarURL = 'data:image/png;base64,' + Buffer.from(final_img.image).toString('base64');
    //! ЗАПИСЬ ссылки avatarURL на файл АВАТАРКИ
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    try {
        //! УДАЛЕНИЕ файла аватара с временной папки tmp
        fs.unlinkSync(tempUpload);

        res.json({ avatarURL }); //? for Kapu$ta

    } catch (error) {
        fs.unlinkSync(tempUpload);
        throw error;
    }
};

module.exports = updateAvatar;