const { Router } = require('express')

// Como ele é uma class eu preciso reservar ele na memória ou instanciar
const NotesController = require('../controllers/NotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const notesRoutes = Router()

// function middleware
function myMiddleware(request, response, next) {
  console.log('Você passou pelo Midd')

  if (!request.body.isAdmin) {
    return response.json({ message: 'user unauthorized' })
  }

  next()
}

// Aqui estou instanciando a class
const notesController = new NotesController()

// Passando o Middleware para todas as rotas
notesRoutes.use(ensureAuthenticated)

// Todas as chamadas da minha rota notes
notesRoutes.post('/', notesController.create)
notesRoutes.get('/:id', notesController.show)
notesRoutes.delete('/:id', notesController.delete)
notesRoutes.get('/', notesController.index)

module.exports = notesRoutes
