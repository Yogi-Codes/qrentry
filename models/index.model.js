const db_config = require('../config/db.config');
const Sequelize = require('sequelize');

// configure sequalize
const sequelize = new Sequelize(
    db_config.DB,
    db_config.USER,
    db_config.PASSWORD, {
        host: db_config.HOST,
        dialect: db_config.dialect,
        operationAliases: false,
        pool: {
            max: db_config.pool.max,
            min: db_config.pool.min,
            acquire: db_config.pool.acquire,
            idle: db_config.pool.idle
        }
    }
)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.ticket = require('./ticket.model')(sequelize, Sequelize);

module.exports = db;