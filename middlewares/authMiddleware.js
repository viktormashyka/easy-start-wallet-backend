const { Unauthorized } = require("http-errors");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    try {
        if (bearer !== "Bearer") {
            throw new Unauthorized("Not authorized. Invalid Bearer")
        }
        if (!token) {
            throw new Unauthorized("Not authorized. No token");
        }
        let user = jwt.decode(token, JWT_SECRET);
        if (!user) {
            throw new Unauthorized("Not authorized. Invalid token");
        }
        const { id } = jwt.verify(token, JWT_SECRET);
        user = await User.findById(id);
        if (!user || !user.token) {
            throw new Unauthorized("Not authorized. Invalid user token");
        };
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        if (error.message === "Invalid sugnature") {
            error.status = 401;
        }
        next(error);
    };
};
module.exports = authMiddleware

