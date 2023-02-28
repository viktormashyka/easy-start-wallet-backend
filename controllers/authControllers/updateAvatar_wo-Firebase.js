const { User } = require("../../models");
const path = require("path");
const fs = require("fs/promises");

//!firebase
// const { storage } = require("../../firebase/config.js");
// const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");


//--------------------------------------------------------------------------------------------
//! ПОЛНЫЙ путь к папке назначения всех файлов-аватарок
console.log("");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
console.log("ПОЛНЫЙ путь к папке назначения всех файлов-аватарок -> avatarsDir:".bgBlue, avatarsDir.blue); //!;
console.log("");

const updateAvatar = async (req, res) => {
    console.log("ОБЪЕКТ -> req.user:".blue, req.user); //!
    console.log("");

    const { path: tempUpload, destination, originalname } = req.file;
    console.log("ОБЪЕКТ -> req.file:".red, req.file); //!;
    console.log("");
    console.log("ПОЛНЫЙ путь к временной папке tmp -> destination:".bgYellow.black, destination.yellow); //!;
    console.log("");
    console.log("ПОЛНЫЙ путь к ориг. файлу аватара во временной папке tmp -> tempUpload:".bgBlue, tempUpload.red); //!;
    console.log("");

    const { id: userId } = req.user
    console.log("____________________________________________");

    //----------------------------------------------------------------------------
    //! Jimp 
    console.log("");
    // const avatarNewJimpName = `Jimp_250x250_${avatarNewName}`;
    const avatarNewJimpName = `Jimp_${userId}_${originalname}`;
    console.log("avatarNewJimpName:".bgMagenta, avatarNewJimpName.bgGreen.red); //!;
    console.log("");


    try {
        //! ПОЛНЫЙ путь к новому Jimp-файлу аватара в папке назначения
        // const resultUpload = path.join(avatarsDir, avatarNewName);
        const resultUpload = path.join(avatarsDir, avatarNewJimpName);
        console.log("ПОЛНЫЙ путь к новому Jimp-файлу аватара в папке назначения -> resultUpload:".bgCyan.black, resultUpload.red); //!;
        console.log("");

        //! ПЕРЕИМЕНОВАНИЕ и ПЕРЕМЕЩЕНИЕ файла аватара с временноцй папки tmp в папку назначения E:\GoIT\Code\goit-node-hw-05\public\avatars
        await fs.rename(tempUpload, resultUpload); //? 2-var
        // await fs.rename(tempUpload, avatarTempURL); //???? 1-var - не перезаписывает Jimp-файлу аватара
        // await fs.rename(avatarTempURL, resultUpload); //? 1-var

        //todo-1 ОТНОСИТЕЛЬНЫЙ путь к новому Jimp-файлу аватара в папке назначения --> OLD-1
        // const avatarURL = path.join("public", "avatars", avatarNewJimpName);
        // console.log("ОТНОСИТЕЛЬНЫЙ путь к новому Jimp-файлу аватара в папке назначения -> avatarURL:".bgGreen.black, avatarURL.green); //!;
        // console.log("");

        //todo-2 АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения --> OLD-2
        const BASE_URL = 'https://contact-book-backend52.onrender.com';
        // const avatarURL = path.join(BASE_URL, "public", "avatars", avatarNewJimpName);
        // console.log("АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения -> avatarURL:".bgGreen.black, avatarURL.green); //!;
        // console.log("");

        //! АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения - вариант Юрия Довжика
        const avatarURL = `${BASE_URL}/static/avatars/${avatarNewJimpName}`; //?
        console.log("АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения -> avatarURL:".bgGreen.black, avatarURL.green); //!;
        console.log("");

        await User.findByIdAndUpdate(req.user._id, { avatarURL });
        // await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });

        res.json({ avatarURL });

    } catch (error) {
        await fs.unlink(tempUpload);
        throw error;
    }
};


module.exports = updateAvatar;