import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { executeQuery } from '../../../infra'
import { PontoAnalise } from '../interfaces'
import { findLastBalneabilidadeQuery } from '../sql'

const getBalneabilidade = catchAsync(async () => {
  const { ponto_analise } = await executeQuery<{ ponto_analise: PontoAnalise }>({
    method: 'one',
    query: findLastBalneabilidadeQuery,
    params: []
  })

  if (!ponto_analise) {
    throw new HttpException(400, 'Não foi possível recuperar os dados da ultima análise')
  }

  return ponto_analise
})

export { getBalneabilidade }
