import { Router } from 'express'
import { getBalnearioInfo, getBalnearios, getMunicipios, postBalneabilidade } from '../services'
import { getBalneabilidade } from '../services/getBalneabilidade'

const balneabilidadeRouter = Router()

balneabilidadeRouter.post('/', postBalneabilidade)
balneabilidadeRouter.get('/', getBalneabilidade)
balneabilidadeRouter.get('/municipios', getMunicipios)
balneabilidadeRouter.get('/municipios/:codigoMunicipio/balnearios', getBalnearios)
balneabilidadeRouter.get('/balnearios/:codigoBalneario', getBalnearioInfo)

export { balneabilidadeRouter }
