const UserController = require('./src/controllers/UserController');
const VerifyNewUser = require('./src/middlewares/VerifyNewRegister');
const VerifyToken = require('./src/middlewares/VerifyToken');

module.exports = (app) => {//register route path for server 
    app.post('/auth/register', VerifyNewUser.checkDuplicateEmail, UserController.register);//, VerifyNewUser.checkRoleExist
    app.post('/auth/login', UserController.login);
    app.post('/user/all', [VerifyToken.verify], UserController.allUsers);
}