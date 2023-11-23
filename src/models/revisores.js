const { wes } = require('../database/db')
const Sequelize = require('sequelize')


// Define your model with the specified columns
const revisores_model = wes.define('revisores_beira', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    freezeTableName: true
});

// Create the table if it doesn't exist
revisores_model.sync();

module.exports = revisores_model