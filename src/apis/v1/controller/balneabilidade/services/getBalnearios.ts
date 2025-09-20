import environments from '../../../../../environments'
import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { cache } from '../../../../../LocalCache/LocalCache'
import { executeQuery } from '../../../infra'
import { Balneario } from '../interfaces/Balneario'
import { findBalnearioByMunicipioQuery } from '../sql'

const getBalnearios = catchAsync(
  async (req: HTTP.Req<void, { codigoMunicipio: string }, void>): Promise<Balneario[]> => {
    const { codigoMunicipio } = req.params
    if (!codigoMunicipio) {
      throw new HttpException(400, '[Balneário] - Parâmetro `codigoMunicipio` é obrigatório')
    }

    const key = `balnearios:${String(codigoMunicipio).trim()}`

    return cache.getOrLoad<Balneario[]>(key, async () => {
      const rows = await executeQuery<Balneario[]>({
        method: 'many',
        query: findBalnearioByMunicipioQuery,
        params: [String(codigoMunicipio).trim()]
      })

      if (!rows?.length) {
        throw new HttpException(404, '[Balnearios] - Nenhum balneário encontrado para esse município.')
      }

      return rows
    }, environments.CACHE_TTL)
  }
)

export { getBalnearios }
