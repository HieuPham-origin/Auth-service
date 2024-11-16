const userService = require("../services/user.service")
exports.createUser = async (req, res, next) => {
    const createUser = await userService.createUser(req)

    req.responseData = {
        status: 201,
        message: 'Successfully! Create new User',
        data: createUser
    };
    next();
}
// exports.sendSharingEmail = async (req, res, next) => {
//     await userService.sendSharingEmail(req)

//     req.responseData = {
//         status: 204,
//         message: 'Successfully! Sent email',
//     };
//     next();
// }
exports.updateUser = async (req, res, next) => {
    const data = await userService.updateUser(req)

    req.responseData = {
        status: 200,
        message: 'Successfully! User updated successfully',
        data
    };
    next();
}

exports.searchUserByEmailOrUsername = async (req, res, next) => {
    const data = await userService.searchUserByEmailOrUsername(req)

    req.responseData = {
        status: 200,
        message: 'Successfully! search user',
        data
    };
    next();
}