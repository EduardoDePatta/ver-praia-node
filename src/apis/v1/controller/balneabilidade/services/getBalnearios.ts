import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { executeQuery } from '../../../infra'
import { PontoAnalise } from '../interfaces'
import { findLastBalneabilidadeQuery } from '../sql'

const getBalnearios = catchAsync(
  async (req: HTTP.Req<void, { codigoMunicipio: string }, void>) => {
    const { codigoMunicipio } = req.params

    if (!codigoMunicipio) {
      throw new HttpException(
        400,
        '[Balneário] - Parâmetro `codigoMunicipio` é obrigatório'
      )
    }

    const { ponto_analise } = await executeQuery<{ ponto_analise: PontoAnalise[] }>({
      method: 'one',
      query: findLastBalneabilidadeQuery,
      params: []
    })

    if (!ponto_analise) {
      throw new HttpException(
        400,
        'Não foi possível recuperar os dados da ultima análise'
      )
    }

    const filtrados = ponto_analise.filter(
      (p) =>
        String(p.MUNICIPIO_COD_IBGE).trim() ===
        String(codigoMunicipio).trim()
    )

    if (!filtrados.length) {
      throw new HttpException(
        404,
        '[Balnearios] - Nenhum balneário encontrado para esse município.'
      )
    }

    const balnearios = filtrados.map((p) => {
      const ultimaAnalise = [...(p.ANALISES || [])].sort((a, b) => {
        const [da, ma, ya] = a.DATA.split('/')
        const [db, mb, yb] = b.DATA.split('/')
        const d1 = new Date(+ya, +ma - 1, +da).getTime()
        const d2 = new Date(+yb, +mb - 1, +db).getTime()
        return d2 - d1
      })[0]

      return {
        codigoBalneario: Number(p.CODIGO),
        balneario: p.BALNEARIO,
        proprio: ultimaAnalise?.CONDICAO === 'PRÓPRIO'
      }
    })

    return balnearios
  }
)

export { getBalnearios }
