const Jimp = require('jimp');

async function resizeXandYbyJimp(tempUpload, x, y) {
    const image = await Jimp.read(tempUpload);
    await image
        .resize(x, y)
        .writeAsync(tempUpload);
};
module.exports = {
    resizeXandYbyJimp,
};