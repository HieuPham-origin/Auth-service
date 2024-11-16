var dotenv = require('dotenv');
var jwt = require("jsonwebtoken");
var ms = require("ms")
dotenv.config();
exports.generateToken = (user) => {
    const expirationDate = Date.now() + ms(process.env.JWT_ACCESS_EXPIRED); // Add offset to the current time

    return jwt.sign({ 
        username:user.username,
        email:user.email,
        _id:user._id,
        role:user.role,
        avatar:user.avatar, 
        expirationDate }, process.env.JWT_ACCESS);
};
exports.generateLoginToken = (user) => {
    const expirationDate = Date.now() + ms(process.env.JWT_LOGIN_EXPIRED); // Add offset to the current time

    // const expirationDate = new Date();
    // expirationDate.setTime(ms(process.env.JWT_LOGIN_EXPIRED));
    return jwt.sign({ 
        username:user.username,
        email:user.email,
        _id:user._id,
        avatar:user.avatar,
        expirationDate 
    }, process.env.JWT_LOGIN);
};
