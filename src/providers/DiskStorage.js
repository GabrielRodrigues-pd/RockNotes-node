const fs = require('fs') // para manipular arquivos
const path = require('path') // para lidar com diretórios
const uploadConfig = require('../configs/upload')

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file), // pega o arquivo da pasta tmp
      path.resolve(uploadConfig.UPLOADS_FOLDER, file) // leva o arquivo para a pasta upload
    )

    return file
  }

  async deleteFile(file) {
    // pega o arquivo da pasta upload
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    // tratamento caso o arquivo não exista
    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    // deleta o arquivo
    await fs.promises.unlink(filePath)
  }
}

module.exports = DiskStorage
