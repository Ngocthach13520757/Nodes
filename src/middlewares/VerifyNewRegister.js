const db = require('../models');
const User = db.User;
const Sequelize = db.Sequelize;
const config = require('../configs/conf');
const ROLEs = config.ROLEs;
const Role = db.Role;

module.exports = {
    async checkDuplicateEmail(req, res, next) {
        try {
            let response = {
                returnCode: 1,
                returnMessage: "",
                data: {
    
                }
            };
            let user = await User.findOne({
                where: {
                    [Sequelize.Op.or]: [{ email: req.body.email }]
                    //email: req.body.email
                }
            });
            if (user) {
                res.status(400).send("Fail, user already exist!");
                return;
            }
            next();
        } catch (error) {
            res.status(500).send("in middleware error " + error);
            return;
        }

    },
    async checkRoleExist(req, res, next) {
        console.log('check role exist');
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLEs.includes(req.body.roles[i].toUpperCase())) {
                res.status(400).send("Fail -> Does NOT exist Role = " + req.body.roles[i]);
                return;
            }
        }
        next();
    }
}