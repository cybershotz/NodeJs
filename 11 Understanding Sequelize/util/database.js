const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'cybershot', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;