const Role = require('./Role');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        firstName: {
            type: Sequelize.STRING,
        },
        avatar: {
            type: Sequelize.STRING,
        },
        lastName: {
            type: Sequelize.STRING,
        },
        gender: {
            type: Sequelize.STRING,
        },
        username: {
            type: Sequelize.STRING,

        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        dateOfBird: {
            type: Sequelize.STRING,
        },
        phoneNumber: {
            type: Sequelize.STRING,
        }
    });
    return User;
}