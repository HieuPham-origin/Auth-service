const express = require('express')
const verifyToken = require("@hieuga678902003/verifytoken");

const router = express.Router();
const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')

// router.get("/login")
router.post("/", userController.createUser)
router.post("/login", authController.login)
// router.get("/login/:token",authController.loginBylink)
router.post("/changePassword", verifyToken, authController.changePassword)


// .post("/sendSharingEmail", verifyToken,  userController.sendSharingEmail)
router.post('/searchUser', verifyToken, userController.searchUserByEmailOrUsername);
router.put("/", verifyToken, userController.updateUser)

module.exports = router