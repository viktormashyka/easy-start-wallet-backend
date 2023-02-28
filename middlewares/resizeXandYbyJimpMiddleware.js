const { changeImageByJimp } = require("../helpers")

const { resizeXandYbyJimp } = changeImageByJimp


//----------------------------------------------------------------
const resizeXandYbyJimpMiddleware = async (req, res, next) => {
    console.log("");

    const { path: tempUpload } = req.file;

    const x = 50; //! ширина Jimp-файла аватарки
    const y = 50; //! высота Jimp-файла аватарки

    await resizeXandYbyJimp(tempUpload, x, y);

    next();
};

module.exports = resizeXandYbyJimpMiddleware;

