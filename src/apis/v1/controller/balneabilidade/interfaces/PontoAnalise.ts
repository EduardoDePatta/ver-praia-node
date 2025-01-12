import { Analise } from './Analise'

export interface PontoAnalise {
  CODIGO: string
  MUNICIPIO_COD_IBGE: string
  MUNICIPIO: string
  PONTO_NOME: string
  BALNEARIO: string
  LOCALIZACAO: string
  LATITUDE: string
  LONGITUDE: string
  ANALISES: Analise[]
}
