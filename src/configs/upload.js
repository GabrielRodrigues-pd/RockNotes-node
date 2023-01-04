const path = require('path')
const multer = require('multer') // biblioteca para fazer uploads
const crypto = require('crypto')

// pasta temporária
const TMP_FOLDER = path.resolve(__dirname, '..', '..', 'tmp')
// pasta onde os arquivos vão ficar
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, 'uploads')

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    }
  })
}

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER
}
