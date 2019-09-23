const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');
const Op = db.Sequelize.Op;
const config = require('../configs/conf');
const jwt = require('jsonwebtoken');

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
        try {
            let username = await userName(firstName, lastName);
            let user = await User.create({
                firstName: firstName,
                lastName: lastName,
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
                expiresIn: 86400 //24h
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
        try {
            let response = {
                returnCode: 1,
                returnMessage: "",
                data: {

                }
            };
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