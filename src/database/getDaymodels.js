const { wes } = require('./db')

async function getModels() {

    const [results] = await wes.query(`SELECT * FROM modelos_revisao_beira`)
    return results
}


module.exports = {getModels}
