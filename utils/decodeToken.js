const jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
const CustomError = require('../errors/CustomError');
dotenv.config();

const decodeToken = (token,next) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_LOGIN);
    
    const currentTimestamp = Date.now();
    const unixTimestamp = new Date(decoded.expirationDate).getTime();

    if (currentTimestamp > unixTimestamp) {
      throw new CustomError("Login token is expired",401);
    }
    
    return decoded;
  } catch (error) {
    next(error)
  }
}

module.exports=decodeToken
