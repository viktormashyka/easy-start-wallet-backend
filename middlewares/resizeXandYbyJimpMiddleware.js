const { changeImageByJimp } = require("../helpers")
const { resizeXandYbyJimp } = changeImageByJimp

const resizeXandYbyJimpMiddleware = async (req, res, next) => {
    const { path: tempUpload } = req.file;
    const x = 50;
    const y = 50;
    await resizeXandYbyJimp(tempUpload, x, y);
    next();
};
module.exports = resizeXandYbyJimpMiddleware;

