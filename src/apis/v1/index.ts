import { Router } from 'express'
import { balneabilidadeRouter } from './controller/balneabilidade/router/balneabilidadeRouter'
import { basicAuthMiddleware } from '../../middlewares'

const routerV1 = Router()

routerV1.use('/balneabilidade', basicAuthMiddleware, balneabilidadeRouter)

export { routerV1 }
