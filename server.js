const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const lancamentos_revisao_model = require('./src/models/lancamentos_revisao')
const modelos_revisao_model = require('./src/models/modelos_revisao')
const motivos_revisao_model = require('./src/models/motivos_revisao')
const revisor_model = require('./src/models/revisores')
const { getModels } = require('./src/database/getDaymodels');
const { create } = require('domain');
const revisores_model = require('./src/models/revisores');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')


app.get('/', async (req, res) => {
  await getModels()
  res.render('index')
})

app.get('/registro', async (req, res) => {
  res.render('registro')
})


app.get('/data', async (req, res) => {
  try {
    const findMotivos = await motivos_revisao_model.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    const findModel = await modelos_revisao_model.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    const findRevisor = await revisor_model.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    let motivos = [];
    let modelos = [];
    let revisores = [];

    findMotivos.forEach(row => {
      const motivoSemTimestamps = {
        id: row.id, // Substitua 'id' pelo nome do seu campo de ID
        motivo: row.motivo,
        ativo: row.ativo
      };
      motivos.push(motivoSemTimestamps);
    });

    findModel.forEach(row => {
      const modelosSemTimestamps = {
        id: row.id, // Substitua 'id' pelo nome do seu campo de ID
        modelo: row.modelo,
        ativo: row.ativo
      };
      modelos.push(modelosSemTimestamps);
    });

    findRevisor.forEach(row => {
      const revisorSemTimestamps = {
        id: row.id, // Substitua 'id' pelo nome do seu campo de ID
        nome: row.nome,
        ativo: row.ativo
      };
      revisores.push(revisorSemTimestamps);
    });

    const responseData = {
      data: {
        motivos,
        modelos,
        revisores
      }
    };

    res.json(responseData);
  } catch (error) {
    console.error('Erro ao buscar motivos:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os motivos.' });
  }
})

app.post('/insertData', async (req, res) => {
  const { revisor, modelo, motivo, quantidade, data_hora } = req.body;


  try {
    console.log(req.body)

    const insertedData = await lancamentos_revisao_model.create({
      id_motivo: motivo.id,
      id_modelo: modelo.id,
      quantidade,
      id_usuario: revisor.id,
      data_hora,
    }
    );

    res.status(201).json({
      success: true,
      message: 'Data inserted successfully',
      data: insertedData,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error inserting data',
      error: error.message,
    });
  }
});

app.post('/post/data', async (req, res) => {
  const { revisores, motivos, modelos, } = req.body;

  console.log(modelos)
  try {

    for (let revisor of revisores) {

      try {
        const [revisorObj, created] = await revisores_model.findOrCreate({
          where: revisor.id != "undefined" ? { id: revisor.id } : { nome: revisor.nome },
        });

        revisorObj.nome = revisor.nome;
        revisorObj.ativo = revisor.ativo;
        await revisorObj.save();

        console.log(`Revisor "${revisor}" ${created ? 'criado' : 'atualizado'}.`);

      } catch (error) {
        console.error(`Erro ao lidar com o revisor "${revisor}":`, error);
      }
    }

    for (let motivo of motivos) {
      try {
        const [motivoObj, created] = await motivos_revisao_model.findOrCreate({
          where: motivo.id != "undefined" ? { id: motivo.id } : { motivo: motivo.motivo },
        });

        motivoObj.motivo = motivo.motivo;
        motivoObj.ativo = motivo.ativo;
        await motivoObj.save();

        console.log(`Motivo "${motivo}" ${created ? 'criado' : 'atualizado'}.`);

      } catch (error) {
        console.error(`Erro ao lidar com o revisor "${motivo}":`, error);
      }
    }


    for (let modelo of modelos) {
      try {
        const [modeloObj, created] = await modelos_revisao_model.findOrCreate({
          where: modelo.id != "undefined" ? { id: modelo.id } : { modelo: modelo.modelo },
        });

        modeloObj.modelo = modelo.modelo;
        modeloObj.ativo = modelo.ativo;
        await modeloObj.save();

        console.log(`Modelo "${modelo}" ${created ? 'criado' : 'atualizado'}.`);

      } catch (error) {
        console.error(`Erro ao lidar com o revisor "${modelo}":`, error);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Data inserted successfully',
      data: 'inseri os dados com sucesso',
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error inserting data',
      error: error.message,
    });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
