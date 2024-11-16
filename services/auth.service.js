const CustomError = require("../errors/CustomError");
const User = require("../models/user.model");
const { generateToken } = require("../utils/generateToken");
const decodeToken = require("../utils/decodeToken");
const { receiveQueue } = require("../utils/consumer");
require("express-async-errors");

exports.login = async (req) => {
    const authData = req.body;

    const user = await User.findByUsernameAndPwr(authData.username, authData.password);
   
    if (user) {
        let accessToken = generateToken(user);
        return {
            user,
            accessToken,
        };
    } 
    else{
        throw new CustomError("Wrong login information", 401);

    }
   
   
    
};
exports.loginByLink = async (req, next) => {
    const token = req.params.token;
    const userData = decodeToken(token, next);
    const user = await User.findById({ _id: userData._id });
    if (user) {
        let accessToken = generateToken(user);
        // res.cookie('token', user.Token, { httpOnly: true, secure: true });

        return {
            user,
            accessToken,
        };
    } else {
        throw new CustomError("Invalid User", 401);
    }
};
exports.changePassword = async (req) => {
    const { oldPwr, newPwr } = req.body;
    console.log(req.body);
    const id = req.user.id;
    // await receiveQueue();
    // console.log(id);
    await User.changePassword(id, oldPwr, newPwr);
    return;
};
