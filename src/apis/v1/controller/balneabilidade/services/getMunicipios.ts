import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { executeQuery } from '../../../infra'
import { PontoAnalise } from '../interfaces'
import { Municipio } from '../interfaces/Municipio'
import { findLastBalneabilidadeQuery } from '../sql'

const getMunicipios = catchAsync(async (): Promise<Municipio[]> => {
  const { ponto_analise } = await executeQuery<{ ponto_analise: PontoAnalise[] }>({
    method: 'one',
    query: findLastBalneabilidadeQuery,
    params: []
  })

  if (!ponto_analise.length) {
    throw new HttpException(400, '[Municipios] - Não foi possível recuperar os dados da ultima análise.')
  }

  const municipios: Municipio[] = Array.from(
    new Map(
      ponto_analise.map(item => [
        item.MUNICIPIO_COD_IBGE,
        {
          municipio: item.MUNICIPIO,
          codigoMunicipio: Number(item.MUNICIPIO_COD_IBGE)
        }
      ])
    ).values()
  );

  return municipios
})

export { getMunicipios }
