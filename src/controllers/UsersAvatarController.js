const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class UsersAvatarController {
  async update(request, response) {
    const user_id = request.user.id
    const avatarFilename = request.file.filename // pegando o nome do avatar
    const diskStorage = new DiskStorage()

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new AppError(
        'Somente usuários autenticados podem mudar o avatar',
        401
      )
    }
    // deletando avatar antigo
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }
    // salvando o avatar novo
    const filename = await diskStorage.saveFile(avatarFilename)
    user.avatar = filename

    // atualizando o avatar do user
    await knex('users').update(user).where({ id: user_id })

    return response.json(user)
  }
}

module.exports = UsersAvatarController
