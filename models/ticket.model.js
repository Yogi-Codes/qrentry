const {DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("ticket", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allownull: false,
            unique: true
        },
        visited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        name: {
            type: DataTypes.STRING,
            defaultValue: 'VIP'
        }
    });
    return Ticket;
}