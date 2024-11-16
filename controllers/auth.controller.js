const authService = require('../services/auth.service')
exports.login = async (req, res, next) => {
    const data = await authService.login(req)
    req.responseData = {
        status: 201,
        message: 'Successfully login!',
        data: data
    };
    next();
}

// exports.loginBylink = async (req, res, next) => {
//     const data = await authService.loginByLink(req, next)
//     req.responseData = {
//         status: 201,
//         message: 'Successfully login!',
//         data: data
//     };
//     next();
// }
exports.changePassword = async (req, res, next) => {
    await authService.changePassword(req)
    req.responseData = {
        status: 204,
        message: 'Successfully change Password!',
    };
    next();
}