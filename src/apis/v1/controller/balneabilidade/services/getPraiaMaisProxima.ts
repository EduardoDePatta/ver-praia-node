import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { executeQuery } from '../../../infra'
import { PraiaProxima } from '../interfaces/PraiaProxima'
import { findPraiaPropriaMaisProximaQuery } from '../sql'

type Req = HTTP.Req<void, { codigoMunicipio: string }, { lat: string, lon: string, raio?: string }>

export const getPraiaPropriaMaisProxima = catchAsync(async (req: Req) => {
  const { codigoMunicipio } = req.params
  const { lat, lon, raio } = req.query

  if (!codigoMunicipio || !lat || !lon) {
    throw new HttpException(400, '[Balneabilidade] - Parâmetros obrigatórios: codigoMunicipio, lat, lon')
  }

  const praiaProxima = await executeQuery<PraiaProxima>({
    method: 'oneOrNone',
    query: findPraiaPropriaMaisProximaQuery,
    params: [
      String(codigoMunicipio).trim(),
      Number(lat),
      Number(lon),
      raio !== undefined ? Number(raio) : null
    ],
  })

  if (!praiaProxima) {
    throw new HttpException(404, '[Balneabilidade] - Nenhum ponto PRÓPRIO encontrado para este município.')
  }

  return praiaProxima
})
