var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const CustomError = require('../errors/CustomError');

var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  }
},{timestamps:true,
  statics:{
    async findByUsernameAndPwr(username, password) {
      const user = await this.findOne({ username: username }); // Correct the field name

      if (!user) {
        return null; // User not found
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password); // Compare the correct field

      if (!isPasswordCorrect) {
        return null; // Incorrect password
      }
      const userObj = user.toObject();

      delete userObj.password;

      return userObj;
    },
    async changePassword(id, oldPwr, newPwr) {
      const user = await this.findById({ _id: id });
  
      if (!user) {
        throw new CustomError("User not exist",403); // User not found
      }
  
      const isPasswordCorrect = await bcrypt.compare(oldPwr, user.password);
      if (!isPasswordCorrect) {
        throw new CustomError("Wrong Passowrd",400);
      }
  
      // Băm mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPwr, 10);
      user.password = hashedNewPassword;
  
      // Cập nhật isCreated nếu nó là false
      if (!user.isCreated) {
        user.isCreated = true;
      }
  
      // Lưu thay đổi
      await user.save();
    }
  }
  
});
module.exports = mongoose.model("User", UserSchema);
