
var dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");
const CustomError = require("../errors/CustomError");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomError("No token provided", 403);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS);

        const { _id, username, role, email, expirationDate } = decoded;

        const currentTimestamp = Date.now();
        const unixTimestamp = new Date(expirationDate).getTime();
        console.log(currentTimestamp, unixTimestamp);
        if (currentTimestamp > unixTimestamp) {
            throw new CustomError("Access token is expired", 401);
        }
        req.user = { id: _id, username, role };
        next();
    } catch (error) {
        next(error)
    }


};
module.exports = verifyToken;
