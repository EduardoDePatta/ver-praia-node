import { HttpException } from '../../../../../exceptions'
import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { executeQuery } from '../../../infra'
import { AnaliseOut, BalnearioDetalhe } from '../interfaces/BalnearioDetalhe'
import { findBalnearioDetalheByCodigoQuery } from '../sql'

type Row = {
  codigo: string
  balneario: string
  municipio: string
  codigoMunicipio: number
  pontoNome: string
  localizacao: string | null
  latitude: string | number | null
  longitude: string | number | null
  analises: AnaliseOut[] | null
  ultimaAnalise: AnaliseOut | null
}

const getBalnearioInfo = catchAsync(
  async (req: HTTP.Req<void, { codigoBalneario: string }, void>): Promise<BalnearioDetalhe> => {
    const { codigoBalneario } = req.params
    if (!codigoBalneario) {
      throw new HttpException(400, '[Balneário] - Parâmetro `codigoBalneario` é obrigatório.')
    }

    const row = await executeQuery<Row>({
      method: 'oneOrNone',
      query: findBalnearioDetalheByCodigoQuery,
      params: [String(codigoBalneario).trim()]
    })

    if (!row) {
      throw new HttpException(404, '[Balneário] - Nenhum balneário encontrado para esse código.')
    }

    const detalhe: BalnearioDetalhe = {
      codigo: row.codigo,
      balneario: row.balneario ?? '',
      municipio: row.municipio ?? '',
      codigoMunicipio: Number(row.codigoMunicipio) || 0,
      pontoNome: row.pontoNome ?? '',
      localizacao: row.localizacao ?? '',
      latitude: row.latitude === null ? null : Number(row.latitude),
      longitude: row.longitude === null ? null : Number(row.longitude),
      analises: Array.isArray(row.analises) ? row.analises : [],
      ultimaAnalise: row.ultimaAnalise ?? null
    }

    return detalhe
  }
)

export { getBalnearioInfo }
