// ele não vai ser so uma função, ele vai ser uma class. Vou usar class pq dentro dela eu posso ter várias functions

const { hash, compare } = require('bcryptjs')

const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    // aqui estou verificando se o email já existe
    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    // Criptografando senha do usuário
    const hashedPassword = await hash(password, 8)

    // aqui estou cadastrando o usuário no banco de dados
    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    return response.status(201).json()
  }

  // Users update function
  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    // conexão com banco de dados
    const database = await sqliteConnection()
    // selecionar o usuário pelo id
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [
      user_id
    ])

    // Caso usuário não exista
    if (!user) {
      throw new AppError('Usuário não encontrado!')
    }

    // Verificar se o email novo já existe
    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso!')
    }

    // Se dentro do name não tiver nada user o user.name
    user.name = name ?? user.name
    user.email = email ?? user.email

    // Verificar se o usuário informou a senha antiga
    if (password && !old_password) {
      throw new AppError(
        'Você precisa informar a senha antiga para definir a nova senha'
      )
    }

    // Verificar se a senha antiga é realmente igual a senha que está cadastrada no banco
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere.')
      }

      user.password = await hash(password, 8)
    }

    // atualizar usuário
    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return response.json()
  }
}

module.exports = UsersController
