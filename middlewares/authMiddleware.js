
const { Unauthorized } = require("http-errors");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;


const { User } = require("../models");


//-----------------------------------------------------------------------------
const authMiddleware = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    try {
        //! Проверка Bearer
        if (bearer !== "Bearer") {
            throw new Unauthorized("Not authorized. Invalid Bearer")
        }
        //! Проверка наличия токена
        if (!token) {
            throw new Unauthorized("Not authorized. No token");
        }
        //! Объект user c payload = { id: user._id, email: user.email, } ==> loginController (1-вариант)
        let user = jwt.decode(token, JWT_SECRET);

        //! Проверка валидности токена
        if (!user) {
            console.log("authMiddleware-->user(jwt):".bgYellow.magenta, user); //!
            throw new Unauthorized("Not authorized. Invalid token");
        }
        //! Весь объект user (2-вариант)
        const { id } = jwt.verify(token, JWT_SECRET);
        console.log("authMiddleware-->id:".bgYellow.blue, id); //!
        user = await User.findById(id);

        //! Проверка user и валидности его токена
        if (!user || !user.token) {
            throw new Unauthorized("Not authorized. Invalid user token");
        };
        //! Добавляем ВЕСЬ объект {user} в объект запроса req.user
        req.user = user;
        req.idUser = id; // это для ТЕСТА (в коде не нужно)
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

