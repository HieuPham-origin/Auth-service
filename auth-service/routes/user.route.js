const express = require('express')
const router = express.Router();
const userController = require('../controllers/user.controller')
const verifyToken = require("@hieuga678902003/verifytoken");

router
    .post("/", userController.createUser)
    .put("/", userController.updateUser)
    // .post("/sendSharingEmail", verifyToken,  userController.sendSharingEmail)
router.post('/searchUser', verifyToken, userController.searchUserByEmailOrUsername);


module.exports = router