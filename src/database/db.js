const Sequelize = require('sequelize');
require('dotenv').config();

const wes = new Sequelize(process.env.DATABASE,process.env.USER,process.env.PASSWORD,{
    dialect:'postgres',
    host: process.env.HOST,
    port: process.env.PORT
})

module.exports = { wes }