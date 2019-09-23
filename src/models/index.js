const fs = require('fs');
const path = require('path');
const db = {};
const Sequelize = require('sequelize');
const config = require('../configs/conf');
console.log('--------------------------------');
const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.User = require('./User')(sequelize, Sequelize);
// db.Role = require('./Role')(sequelize, Sequelize);
fs.readdirSync(__dirname)
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        let name = file.replace('.js', '');
        db[name] = require(`./${name}`)(sequelize, Sequelize);
    });

db.Role.belongsToMany(db.User, { through: 'user_roles', foreignKey: 'roleId', otherKey: 'userId' });
db.User.belongsToMany(db.Role, { through: 'user_roles', foreignKey: 'userId', otherKey: 'roleId' });

module.exports = db;
