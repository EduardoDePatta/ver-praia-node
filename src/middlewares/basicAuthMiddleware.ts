import { RequestHandler } from 'express'
import { HttpException } from '../exceptions'
import environments from '../environments'

declare global {
  namespace Express {
    interface Request {
      token: string
    }
  }
}

const basicAuthMiddleware: RequestHandler = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new HttpException(401, 'Autenticação necessária.')
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    if (typeof environments.BASIC_AUTH_USERNAME !== 'string' || typeof environments.BASIC_AUTH_PASSWORD !== 'string') {
      console.error('Environment variables are not strings:', {
        username: environments.BASIC_AUTH_USERNAME,
        password: environments.BASIC_AUTH_PASSWORD
      })
      throw new HttpException(500, 'Configuração do servidor inválida.')
    }

    if (username.trim() === environments.BASIC_AUTH_USERNAME.trim() && password.trim() === environments.BASIC_AUTH_PASSWORD.trim()) {
      console.log('Authentication successful')
      return next()
    }

    throw new HttpException(401, 'Autenticação necessária.')
  } catch (err) {
    next(err)
  }
}

export { basicAuthMiddleware }
