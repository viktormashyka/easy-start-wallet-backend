const { User } = require("../../models");
const path = require("path");
const fs = require("fs");

const { lineBreak } = require("../../services");




//--------------------------------------------------------------------------------------------
const updateAvatar2 = async (req, res) => {
    const { _id: owner } = req.user;

    const user = await User.findOne(owner);

    const { date, month, year, sex, email, firstName, lastName } = req.body;

    const avatar = req.file;

    if (avatar) {
        const img = fs.readFileSync(req.file.path, 'base64'); //!!!

        const final_img = {
            contentType: req.file.mimetype,
            image: Buffer.from(img, 'base64')
        };

        const isAvatar = await Image.findOne({ owner });

        if (isAvatar) {
            await Image.findByIdAndUpdate(isAvatar.id, { avatar: { ...final_img } });
        } else {
            await Image.create({ owner, avatar: { ...final_img } });
        }
        const getAvatar = await Image.findOne({ owner });
        const image = getAvatar.avatar.image;
        const avatarURL = 'data:image/png;base64,' + Buffer.from(image).toString('base64');
        //   const production = "https://kapusta-server.herokuapp.com";
        //   const development = "http://localhost:4000";
        //   const url =
        //     process.env.NODE_ENV === "development" ? development : production;
        //   const avatarURL = `${url}/static/avatars/${filename}`;
        const result = await User.findByIdAndUpdate(
            owner,
            {
                firstName: checkData(firstName, user.firstName),
                lastName: checkData(lastName, user.lastName),
                gender: checkData(sex, user.gender),
                dateBirth: checkData(date, user.date),
                monthBirth: checkData(month, user.month),
                yearBirth: checkData(year, user.year),
                email: checkData(email, user.email),
                avatarURL: avatarURL,
            },
            { new: true }
        );
        res.status(200).json(result);
    } else {
        const result = await User.findByIdAndUpdate(
            owner,
            {
                firstName: checkData(firstName, user.firstName),
                lastName: checkData(lastName, user.lastName),
                gender: checkData(sex, user.gender),
                dateBirth: checkData(date, user.date),
                monthBirth: checkData(month, user.month),
                yearBirth: checkData(year, user.year),
                email: checkData(email, user.email),
            },
            { new: true }
        );
        res.status(200).json(result);
    }
};

module.exports = updateAvatar2;