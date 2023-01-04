const { Router } = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

// Como ele é uma class eu preciso reservar ele na memória ou instanciar
const UsersController = require('../controllers/UsersController')
// importando o controler para atualizar o avatar
const UsersAvatarController = require('../controllers/UsersAvatarController')

// importando o Middleware
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

// function middleware
function myMiddleware(request, response, next) {
  console.log('Você passou pelo Midd')

  if (!request.body.isAdmin) {
    return response.json({ message: 'user unauthorized' })
  }

  next()
}

// Aqui estou instanciando a class
const usersController = new UsersController()
const usersAvatarController = new UsersAvatarController()

// Aqui estou usando a o middleware
usersRoutes.post('/', usersController.create)

// Usando o Middleware
usersRoutes.put('/', ensureAuthenticated, usersController.update)

// rota para atualizar um campo específico, no caso a foto do user
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update
)

module.exports = usersRoutes
