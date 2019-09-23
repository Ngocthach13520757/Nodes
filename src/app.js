const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./configs/conf');
const errorHandler = require('../src/_helpers/ErorrHandler');
const db = require('./models');
const Role = db.Role;
//const Role = db.User;
//console.log(db);

const app = express();
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(errorHandler);

require('../routes')(app);
db.sequelize.sync({ force: false }).then(() => {
    app.listen(config.port, () => {
        console.log(config.hello);
    })
});
////
// function initial() {
//     Role.create({
//         id: 1,
//         name: "USER"
//     });

//     Role.create({
//         id: 2,
//         name: "ADMIN"
//     });

//     Role.create({
//         id: 3,
//         name: "PM"
//     });
// }