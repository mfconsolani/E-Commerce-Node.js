const dotenv = require('dotenv').config()

const options = {
    client: 'mysql',
    connection: {
        host: process.env.HOST,
        user: 'root',
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
}

module.exports = {
    options
}