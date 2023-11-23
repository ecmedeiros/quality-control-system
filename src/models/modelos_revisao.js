const { wes } = require('../database/db')
const Sequelize = require('sequelize')


// Define your model with the specified columns
const modelos_revisao_model = wes.define('modelos_revisao_beira', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    modelo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
}, {
    freezeTableName: true
});

// Create the table if it doesn't exist
modelos_revisao_model.sync();

module.exports = modelos_revisao_model