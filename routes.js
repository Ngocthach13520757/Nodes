const UserController = require('./src/controllers/UserController');
const VerifyNewUser = require('./src/middlewares/VerifyNewRegister');
const VerifyToken = require('./src/middlewares/VerifyToken');
const Upload = require('./src/middlewares/Upload');

module.exports = (app) => {//register route path for server 
    app.post('/auth/register', Upload.single('avatar'), VerifyNewUser.checkDuplicateEmail, UserController.register);//, VerifyNewUser.checkRoleExist
    app.post('/auth/login', UserController.login);
    app.post('/user/all', [VerifyToken.verify], UserController.allUsers);
    app.post('/user/info', [VerifyToken.verify], UserController.userInfo);
    app.post('/upload', [Upload.single('avatar'), VerifyNewUser.checkDuplicateEmail], UserController.upload);
}