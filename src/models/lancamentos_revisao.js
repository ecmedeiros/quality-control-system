const { wes } = require('../database/db')
const Sequelize = require('sequelize')


// Define your model with the specified columns
const lancamentos_revisao_model = wes.define('lancamentos_revisao_beira', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_motivo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_modelo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    quantidade: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true
});

// Create the table if it doesn't exist
lancamentos_revisao_model.sync();

module.exports = lancamentos_revisao_model