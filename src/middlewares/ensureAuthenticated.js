const { verify } = require('jsonwebtoken') // function do jwt
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth') // configs de autenticação

function ensureAuthenticated(request, response, next) {
  // o token do user está dentro do headers.authorization
  const authHeader = request.headers.authorization

  // Se o token não existir
  if (!authHeader) {
    throw new AppError('JWT Token não informado', 401)
  }

  // pegando somente o token e colocando ele em uma var token
  // Estamos pegando o token transformando em um array e pegando so a segundo posição que é o token puro
  const [, token] = authHeader.split(' ')

  // Tratamento de exceção
  try {
    // Verificar se o jwt é um token válido e criando um apelido de user_id para o sub
    const { sub: user_id } = verify(token, authConfig.jwt.secret)

    // Estamos voltando o id que colocamos dentro do token de string para Number para guardar no banco de dados
    request.user = {
      id: Number(user_id)
    }
    return next()

    // se for um token inválido
  } catch {
    throw new AppError('JWT Token inválido', 401)
  }
}

module.exports = ensureAuthenticated
