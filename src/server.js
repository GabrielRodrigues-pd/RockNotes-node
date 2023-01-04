require('express-async-errors')
require('dotenv/config') // importação para acesso as variáveis

const migrationsRun = require('./database/sqlite/migrations')

const AppError = require('./utils/AppError')
// importar o upload
const uploadConfig = require('./configs/upload')

// biblioteca para fazer comunicação com o front end
const cors = require('cors')

// express para trabalharmos com requisições HTTP
const express = require('express')

const routes = require('./routes')
// meu banco de dados
migrationsRun()

const app = express()
app.use(cors()) // <--- cors ---
app.use(express.json())
// criar a rota files
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

// Tratando caso tenha erro para a aplicação não parar
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))
