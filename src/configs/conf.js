module.exports = {
    port: 8081,
    hello: `server is started ${new Date()} on port 8081`,
    secret: '',
    ROLEs: ['USER', 'ADMIN', 'PM'],
    db: {
        database: 'node',
        username: 'root',
        password: 'letmeknow',
        options: {
            host: 'localhost',
            dialect: 'mysql',
            operatorsAliases: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    },
    jwt: {
        secretkey: 'TsTEBYUnU7nG4CasNT3rrN73retGVDw3'
    }
}