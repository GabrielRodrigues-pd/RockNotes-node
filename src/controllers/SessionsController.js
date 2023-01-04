const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')

// Config criada e o método Sign
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    // pega os dados do usuário
    const user = await knex('users').where({ email }).first()
    // Se não existir email
    if (!user) {
      throw new AppError('E-mail e/ou senha incorreta', 401)
    }
    // Compara a senha digitada com a senha no banco do usuário
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('E-mail e/ou senha incorreta', 401)
    }

    // Etapa pos validação de senha e email
    // estou pegando minha frase secreta e o tempo de expiração
    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token })
  }
}

module.exports = SessionsController
