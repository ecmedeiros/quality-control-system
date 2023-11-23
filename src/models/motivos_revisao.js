const { wes } = require('../database/db')
const Sequelize = require('sequelize')


// Define your model with the specified columns
const motivo_revisao_model = wes.define('motivos_revisao_beira', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    motivo: {
        type: Sequelize.STRING,
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
motivo_revisao_model.sync();

module.exports = motivo_revisao_model