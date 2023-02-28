const { User } = require("../../models");
const path = require("path");
// const fs = require("fs/promises"); //todo 1
const fs = require("fs"); //todo 2

const { lineBreak } = require("../../services");

//!firebase +++++++++++++++++++++++++++++++++++++++++++++++
// //! Import the functions you need from the SDKs you need
// const { initializeApp } = require("firebase/app");
// const { getStorage } = require("firebase/storage");

// //! Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyAJCkgGuoopUtogXXP5uwOnsJ29-UCECiY",
//     authDomain: "contacts-book-backend.firebaseapp.com",
//     projectId: "contacts-book-backend",
//     storageBucket: "contacts-book-backend.appspot.com",
//     messagingSenderId: "328355692785",
//     appId: "1:328355692785:web:a473dcce1b45a071456950"
// };

// //! Initialize Firebase
// const app = initializeApp(firebaseConfig);
// console.log();
// console.log("app:".bgRed.black, app);//!

// const storage = getStorage(app);

//! ++++++++ firebase +++++++++
// const { storage } = require("../../firebase/config.js");

// const { ref, uploadBytes, getDownloadURL, getBlob } = require("firebase/storage");
//!firebase +++++++++++++++++++++++++++++++++++++++++++++++


// const fetch = require("node-fetch");

const { Buffer, Blob } = require('buffer'); //?


//--------------------------------------------------------------------------------------------
//! ПОЛНЫЙ путь к папке назначения всех файлов-аватарок
console.log("");
const avatarsDir = path.join(__dirname, "../../", "public", "avatars");
console.log("ПОЛНЫЙ путь к папке назначения всех файлов-аватарок -> avatarsDir:".bgBlue, avatarsDir.blue); //!;
console.log("");

const updateAvatar = async (req, res) => {
    console.log("ОБЪЕКТ -> req.user:".blue, req.user); //!
    const { id: userId } = req.user
    console.log("");

    lineBreak();
    const { path: tempUpload, destination, originalname } = req.file;
    console.log("ОБЪЕКТ -> req.file:".red, req.file); //!;
    console.log("");
    console.log("ПОЛНЫЙ путь к временной папке tmp -> destination:".bgYellow.black, destination.yellow); //!;
    console.log("");
    console.log("ПОЛНЫЙ путь к ориг. файлу аватара во временной папке tmp -> tempUpload:".bgBlue, tempUpload.red); //!;
    console.log("");
    lineBreak();
    console.log("");
    //----------------------------------------------------------------------------

    // //! ПЕРЕИМЕНОВАНИЕ файла АВАТАРКИ (пока не используется)
    // // const avatarNewJimpName = `Jimp_${userId}_${originalname}`; //?
    // const [filename, extension] = originalname.split(".");
    // const avatarNewJimpName = `${userId}.${extension}`;
    // console.log("avatarNewJimpName:".bgMagenta, avatarNewJimpName.bgGreen.red); //!;
    // console.log("");


    //! ++++++++++++++++++++++++++++++++++++ Запись файла АВАТАРКИ в mongoDB +++++++++++++++++++++++++++++++++++++
    const img = fs.readFileSync(tempUpload, 'base64');
    console.log("img:".bgGreen.black, img); //!;
    console.log();

    const final_img = {
        contentType: req.file.mimetype,
        image: Buffer.from(img, 'base64')
    };
    console.log("final_img:".bgGreen.black, final_img); //!;
    console.log("");

    //!  Получаем строку-файл АВАТАРКИ из объекта avatarImage
    // const image = req.user.avatarImage.image;
    // console.log("req.user.avatarImage.image_ДО:".bgRed.black, image); //!;
    // console.log("");

    // //? ----- !!! С ипользованием  поля avatarImage в MongoDB (пока не надо):
    // //! Записываем файл АВАТАРКИ в MongoDB в объект avatarImage 
    // await User.findByIdAndUpdate(req.user._id, { avatarImage: { ...final_img } });

    // //? ----- !!! С ипользованием  поля avatarImage в MongoDB (пока не надо):
    // //! Получаем обновленного userUpdate 
    // const userUpdate = await User.findOne(req.user._id);
    // // console.log("userUpdate:".bgBlue.black, userUpdate); //!;
    // const imageUpdate = userUpdate.avatarImage.image;
    // // console.log("userUpdate.avatarImage.image:".bgBlue.black, imageNew); //!;
    // // console.log("");

    //! Получение АБСОЛЮТНОЙ ссылки avatarURL на файл АВАТАРКИ
    // const avatarURL = 'data:image/png;base64,' + Buffer.from(imageUpdate).toString('base64'); //? ----- !!! С ипользованием  поля avatarImage в MongoDB (пока не надо)
    const avatarURL = 'data:image/png;base64,' + Buffer.from(final_img.image).toString('base64'); //!* так, если не создавать в MongoDB поле avatarImage
    console.log("АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу АВАТАРКИ --> avatarURL:".bgGreen.black); //!;
    console.log(avatarURL.green); //!;
    console.log("");

    //! ЗАПИСЬ ссылки avatarURL на файл АВАТАРКИ
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    //! ____________________________________ Запись файла АВАТАРКИ в mongoDB ____________________________________



    try {
        //? ПОЛНЫЙ путь к новому Jimp-файлу аватара в папке назначения
        // const resultUpload = path.join(avatarsDir, avatarNewJimpName);
        // console.log("ПОЛНЫЙ путь к новому Jimp-файлу аватара в папке назначения -> resultUpload:".bgCyan.black, resultUpload.red); //!;
        // console.log("");


        //? ПЕРЕИМЕНОВАНИЕ и ПЕРЕМЕЩЕНИЕ файла аватара с временной папки tmp в папку назначения E:\GoIT\Code\goit-node-hw-05\public\avatars
        // await fs.rename(tempUpload, resultUpload);


        //? АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения - вариант Юрия Довжика
        // const BASE_URL = 'https://contact-book-backend52.onrender.com';
        // const avatarURL2 = `${BASE_URL}/static/avatars/${avatarNewJimpName}`; //?
        // console.log("АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу аватара в папке назначения -> avatarURL2:".bgGreen.black, avatarURL2.green); //!;
        // console.log("");


        //!+++++++++++++++++++++++++++++++++++++ Firebase +++++++++++++++++++++++++++++++++++++++++++++
        //! Отправка АВАТАР на Firebase Storage без обработки - НЕ РАБОТАЕТ
        // const storageRef = ref(storage, `avatars/${avatarNewJimpName}`);

        // console.log("storageRef:".bgYellow.black, storageRef); //!
        // // const resp = await fetch("E:/GoIT/Code/pet-project_react-hw8_backend/tmp/Anxiety.jpeg");
        // // const resp = "E:/GoIT/Code/pet-project_react-hw8_backend/tmp/Anxiety.jpeg";
        // // const blob = await tempUpload.blob();

        // const blob = new Blob([tempUpload], { type: 'image/png' });
        // console.log("blob:".bgYellow.black, blob); //!

        // await uploadBytes(storageRef, blob);


        //! Получение АБСОЛЮТНОЙ ссылки на файл АВАТАРКИ с Firebase Storage без обработки
        // // const avatarURL2 = await getDownloadURL(ref(storage, `avatars/${avatarNewJimpName}`));
        // const avatarURL2 = await getDownloadURL(ref(storage, `avatars/${originalname}`));
        // console.log("АСОЛЮТНЫЙ (ПОЛНЫЙ) путь к новому Jimp-файлу АВАТАРКИ --> avatarURL2:".bgGreen.black, avatarURL2.green); //!;
        // console.log("");


        //! НЕ РАБОТАЕТ
        // //? ПЕРЕИМЕНОВАНИЕ файла аватара с временной папки tmp в папку назначения E:\GoIT\Code\goit-node-hw-05\public\avatars
        // const resp = await fetch(avatarURL2);
        // console.log("resp:".bgGreen.black, resp); //!
        // const file = await resp.blob(); //! 1- вариант
        // // const file = new Blob([resp]); //! 2- вариант (экперементальный)
        // console.log("file:".bgBlue, file); //!
        // const storageRef = ref(storage, `avatars/${avatarNewJimpName}`);
        // console.log("storageRef:".bgYellow.black, storageRef); //!
        // await uploadBytes(storageRef, file); //! Cannot read properties of undefined (reading 'byteLength')
        //!_________________________________________ Firebase _________________________________________


        //! УДАЛЕНИЕ файла аватара с временной папки tmp
        // await fs.unlink(tempUpload); //todo 1
        fs.unlinkSync(tempUpload); //todo 2

        // //! ЗАПИСЬ  в ---> avatarURL2 ссылки ссылки на файл АВАТАРКИ с Firebase Storage без обработки
        // await User.findByIdAndUpdate(req.user._id, { avatarURL2 });
        // // await User.findByIdAndUpdate(req.user._id, { avatarURL2 }, { new: true });


        //* ОТВЕТ
        // res.json({ avatarURL, avatarURL2 });
        res.json({ avatarURL }); //? for Kapu$ta

    } catch (error) {
        // await fs.unlink(tempUpload); //todo 1
        fs.unlinkSync(tempUpload); //todo 2
        throw error;
    }
};

module.exports = updateAvatar;