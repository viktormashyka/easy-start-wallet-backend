const Jimp = require('jimp');


async function resizeXandYbyJimp(tempUpload, x, y) {
    const image = await Jimp.read(tempUpload);
    await image
        .resize(x, y)
        // .quality(60) // set JPEG quality
        // .greyscale() // set greyscale
        .writeAsync(tempUpload);
};


module.exports = {
    resizeXandYbyJimp,
};