const sendSharingNoteEmail = require("../utils/sendMail")
const { generateLoginToken } = require("../utils/generateToken")
const User = require("../models/user.model")
const CustomError = require("../errors/CustomError")
var bcrypt = require("bcrypt");
const { receiveQueue } = require("../utils/consumer");
require("express-async-errors");
const { sendQueue, sendQueue1 } = require("../utils/producer");
const jwt = require("jsonwebtoken");
require('dotenv').config()
exports.createUser = async (req) => {

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("This account has been created", 400)
  }

  const username = email.split('@')[0];
  let hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    username,
    password: hashedPassword
  });

  const successCreate = await newUser.save();
  await sendQueue1({ userId: successCreate._id })
  return successCreate;


}

// exports.sendSharingEmail = async (req) => {
//   const { userIdReceived } = req.body;
//   const user = await User.findById({ _id: req.user.id });
//   if (!user) {
//     throw new CustomError("User does not exist", 404);
//   }

//   const noteIdSent = content

//   const userReceived = await User.findById({ _id: userIdReceived });
//   console.log(userReceived)
//   if (!userReceived) {
//     throw new CustomError("Receiving user does not exist", 404);
//   }

//   sendSharingNoteEmail(user.email, userReceived.email, noteIdSent);

//   return;
// };

exports.updateUser = async (req) => {
  const { id, name, email } = req.body;

  // Check if user exists
  const user = await User.findById(id);
  if (!user) {
    throw new CustomError("user not found", 404);
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();
  return user;
};

exports.searchUserByEmailOrUsername = async (req) => {
  const { query } = req.body;

  if (!query) {
    throw new CustomError("Search query is missing", 400);
  }

  const user = await User.findOne({
    $or: [{ email: query }, { username: query }],
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

