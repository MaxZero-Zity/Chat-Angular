require('dotenv').config();

module.exports = {
    development:{
        "username": "root",
        "password": "123456",
        "database": "ngm",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "port":"8000"
    },
    test:{
        "username": "root",
        "password": "123456",
        "database": "ngm",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "port":"8000"
    },
    production: {
        "username": "root",
        "password": "123456",
        "database": "ngm",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "port":"8000"
    }
}
