const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;
const config = require('../configs/conf');
const jwt = require('jsonwebtoken');
const Path = require('path');
const Resize = require('../_helpers/ResizeImg')

module.exports = {
    async register(req, res, next) {
        let response = {
            returnCode: 1,
            returnMessage: "",
            data: {

            }
        };
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let gender = req.body.gender;//0 male, 1 female
        let dateOfBird = req.body.dateOfBird;
        let phoneNumber = req.body.phoneNumber;

        let password = req.body.password;
        let email = req.body.email;
        let avatar = '';

        try {
            if (!req.file && gender == 0) {//check if user upload avtar of use default avatar
                avatar = 'male.png';
            } else if (!req.file && gender == 1) {
                avatar = 'female.png';
            } else {
                const imagePath = Path.join(__dirname, '../..//public/avatars');
                // console.log(req.file);

                const fileUpload = new Resize(imagePath);
                if (!req.file) {
                    res.status(401).json({ error: 'Please provide an image' });
                }
                avatar = await fileUpload.save(req.file.buffer);
            }
            let username = await userName(firstName, lastName);
            let user = await User.create({
                firstName: firstName,
                lastName: lastName,
                avatar: avatar,
                gender: (gender == 0) ? "male" : "female",
                dateOfBird: dateOfBird,
                phoneNumber: phoneNumber,
                username: username,
                email: email,
                password: bcrypt.hashSync(password, 8),
            });
            response.returnMessage = "User has been created"
            response.data.username = username;

            res.status(200).json(response);
        } catch (error) {
            response.returnCode = 0;
            response.returnMessage = "User registered not successfully! " + error;
            res.status(500).json(response);
        }
    },
    async login(req, res, next) {
        let username = req.body.username;
        let password = req.body.password;
        let response = {
            returnCode: 1,
            returnMessage: "",
            data: {

            }
        };
        try {
            let user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (!user) {
                response.returnCode = 0;
                response.message = "User not exist";
                return res.status(404).json(response);
            }
            let passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                response.returnCode = 0;
                response.returnMessage = "Password invalid";
                return res.status(401).json(response);
            }
            let token = jwt.sign({ id: user.id }, config.jwt.secretkey, {
                expiresIn: 7200 //24h
            })
            response.returnCode = 1;
            response.returnMessage = "Login success";
            response.data.token = token
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send("Login failed" + error);
        }
    },
    async allUsers(req, res, next) {
        let response = {
            returnCode: 1,
            returnMessage: "",
            data: {

            }
        };
        try {

            let users = await User.findAll({
                attributes: { exclude: ["password"] }
            })
            response.returnMessage = "Get success " + users.length + " users";
            response.data.users = users;
            res.status(200).json(response);

        } catch (error) {
            response.returnMessage = "Get failed";
            response.returnCode = 0;
            res.status(500).json(response);
        }
    },
    async userInfo(req, res, next) {//get user info 
        let response = {
            returnCode: 1,
            returnMessage: "",
            data: {

            }
        };
        try {
            let port = "8081";
            let url = req.protocol + '://' + req.hostname + (port ? ':' + port : '') + '/avatars';

            let user = await User.findByPk(req.userId);
            delete user.dataValues.password;
            response.returnMessage = "Success";
            response.data.user = user;
            response.data.user.avatar = url + '/' + response.data.user.avatar;
            res.status(200).json(response);

        } catch (error) {
            response.returnMessage = "Get failed " + error;
            response.returnCode = 0;
            res.status(500).json(response);
        }
    },
    async upload(req, res, next) {
        const imagePath = Path.join(__dirname, '../..//public/avatars');
        // console.log(req.file);

        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            res.status(401).json({ error: 'Please provide an image' });
        }
        const filename = await fileUpload.save(req.file.buffer);
        return res.status(200).json({ name: req.body.thach });
    }
}

async function userName(firstName, lastName) {
    let users = await User.findAll({
        where: {
            firstName: firstName,
            lastName: lastName,
        }
    });
    let split = lastName.split(" ");
    let str = "";
    split.forEach(word => {
        str += word.substr(0, 1);
    });
    let userName = firstName + str + (users.length + 1);
    return userName.toLocaleLowerCase();
}