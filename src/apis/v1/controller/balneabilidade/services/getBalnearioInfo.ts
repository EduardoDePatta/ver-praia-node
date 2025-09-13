import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { executeQuery } from '../../../infra'
import { PontoAnalise } from '../interfaces'
import { AnaliseOut, BalnearioDetalhe } from '../interfaces/BalnearioDetalhe'
import { findLastBalneabilidadeQuery } from '../sql'

function parseDateBRtoISO(d: string | undefined): string | null {
  if (!d) return null
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d.trim())
  if (!m) return null
  const [, dd, mm, yyyy] = m
  const iso = `${yyyy}-${mm}-${dd}T00:00:00.000Z`
  const ts = Date.parse(iso)
  return Number.isNaN(ts) ? null : iso
}

const getBalnearioInfo = catchAsync(
  async (req: HTTP.Req<void, { codigoBalneario: string }, void>): Promise<BalnearioDetalhe> => {
    const { codigoBalneario } = req.params

    if (!codigoBalneario) {
      throw new HttpException(400, '[Balneário] - Parâmetro `codigoBalneario` é obrigatório.')
    }

    const { ponto_analise } = await executeQuery<{ ponto_analise: PontoAnalise[] }>({
      method: 'one',
      query: findLastBalneabilidadeQuery,
      params: []
    })

    if (!ponto_analise?.length) {
      throw new HttpException(400, '[Balneário] - Não foi possível recuperar os dados da última análise.')
    }

    const ponto = ponto_analise.find(p => String(p.CODIGO).trim() === String(codigoBalneario).trim())

    if (!ponto) {
      throw new HttpException(404, '[Balneário] - Nenhum balneário encontrado para esse código.')
    }

    const analisesOrdenadas: AnaliseOut[] = [...(ponto.ANALISES || [])]
      .map(a => {
        const dataISO = parseDateBRtoISO(a.DATA)
        const condicao = (a.CONDICAO || '').toUpperCase().trim()
        const proprio =
          condicao === 'PRÓPRIO' ? true :
            condicao === 'IMPRÓPRIO' ? false :
              null

        const resultadoNum = Number.isFinite(Number(a.RESULTADO))
          ? Number(a.RESULTADO)
          : null

        return {
          dataBr: a.DATA || '',
          dataISO,
          chuva: a.CHUVA || '',
          condicao: a.CONDICAO || '',
          resultado: resultadoNum,
          proprio
        }
      })
      .sort((a, b) => {
        const tA = a.dataISO ? Date.parse(a.dataISO) : -Infinity
        const tB = b.dataISO ? Date.parse(b.dataISO) : -Infinity
        return tB - tA
      })

    const ultimaAnalise = analisesOrdenadas[0] ?? null

    const detalhe: BalnearioDetalhe = {
      codigo: String(ponto.CODIGO),
      balneario: ponto.BALNEARIO ?? '',
      municipio: ponto.MUNICIPIO ?? '',
      codigoMunicipio: Number(ponto.MUNICIPIO_COD_IBGE) || 0,
      pontoNome: ponto.PONTO_NOME ?? '',
      localizacao: ponto.LOCALIZACAO ?? '',
      latitude: Number.isFinite(Number(ponto.LATITUDE)) ? Number(ponto.LATITUDE) : null,
      longitude: Number.isFinite(Number(ponto.LONGITUDE)) ? Number(ponto.LONGITUDE) : null,
      analises: analisesOrdenadas,
      ultimaAnalise
    }

    return detalhe
  }
)

export { getBalnearioInfo }
