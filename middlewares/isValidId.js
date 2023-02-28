const { isValidObjectId } = require("mongoose");
const { RequestError } = require("../helpers")

const isValidId = (req, res, next) => {
    let id = null;
    id = req.params.transactionId;
    if (!id) {
        id = req.params.contactId;
    };
    const isCorrectId = isValidObjectId(id);
    if (!isCorrectId) {
        const error = RequestError(400, `${id} is not corrent id format`);
        next(error);
    }
    next();
};

module.exports = isValidId;