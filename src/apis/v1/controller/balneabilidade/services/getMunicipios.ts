import environments from '../../../../../environments'
import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { cache } from '../../../../../LocalCache/LocalCache'
import { executeQuery } from '../../../infra'
import { Municipio } from '../interfaces/Municipio'
import { findMunicipiosQuery } from '../sql'

const key = 'municipios:all'

const getMunicipios = catchAsync(async (): Promise<Municipio[]> => {
  return cache.getOrLoad<Municipio[]>(key, async () => {
    const rows = await executeQuery<Municipio[]>({
      method: 'many',
      query: findMunicipiosQuery
    })

    if (!rows?.length) {
      throw new HttpException(400, '[Municipios] - Não foi possível recuperar os dados da ultima análise.')
    }

    return rows
  }, environments.CACHE_TTL)
})

export { getMunicipios }
