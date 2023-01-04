// Importando as configurações
const config = require('../../../knexfile')
// Importando o knex
const knex = require('knex')

// Criando a conexão com as configurações
const connection = knex(config.development)

// Exportar a nossa conexão
module.exports = connection
