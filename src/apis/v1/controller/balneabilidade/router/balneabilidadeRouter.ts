import { Router } from 'express'
import { postBalneabilidade } from '../services'
import { getBalneabilidade } from '../services/getBalneabilidade'

const balneabilidadeRouter = Router()

balneabilidadeRouter.post('/', postBalneabilidade)
balneabilidadeRouter.get('/', getBalneabilidade)

export { balneabilidadeRouter }
