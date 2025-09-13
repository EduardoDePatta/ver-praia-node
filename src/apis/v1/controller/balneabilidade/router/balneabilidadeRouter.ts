import { Router } from 'express'
import { getMunicipios, postBalneabilidade } from '../services'
import { getBalneabilidade } from '../services/getBalneabilidade'

const balneabilidadeRouter = Router()

balneabilidadeRouter.post('/', postBalneabilidade)
balneabilidadeRouter.get('/', getBalneabilidade)
balneabilidadeRouter.get('/municipios', getMunicipios)

export { balneabilidadeRouter }
