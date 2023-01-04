const { Router } = require('express')

// Como ele é uma class eu preciso reservar ele na memória ou instanciar
const TagsController = require('../controllers/TagsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const tagsRoutes = Router()

// function middleware
function myMiddleware(request, response, next) {
  console.log('Você passou pelo Midd')

  if (!request.body.isAdmin) {
    return response.json({ message: 'user unauthorized' })
  }

  next()
}

// Aqui estou instanciando a class
const tagsController = new TagsController()

// Aqui estou usando a o middleware
tagsRoutes.get('/', ensureAuthenticated, tagsController.index)

module.exports = tagsRoutes
