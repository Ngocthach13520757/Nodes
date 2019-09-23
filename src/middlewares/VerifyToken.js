const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const Role = db.Role;
const config = require('../configs/conf');

module.exports = {
    verify: (req, res, next) => {
        let response = {
            returnCode: 1,
            returnMessage: "",
            data: {

            }
        };
        let token = req.headers['x-access-token'];

        if (!token) {
            response.returnCode = 0;
            response.returnMessage = "No token provided";
            return res.status(403).json(response);
        }

        jwt.verify(token, config.jwt.secretkey, (err, decoded) => {
            if (err) {
                response.returnCode = 0;
                response.returnMessage = "Fail to Authentication. Error " + err;
                return res.status(500).json(response);
            }
            req.userId = decoded.id;
            next();
        });
    }
}