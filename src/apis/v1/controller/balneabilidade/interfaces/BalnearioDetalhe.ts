export interface AnaliseOut {
  dataBr: string
  dataISO: string | null
  chuva: string
  condicao: string
  resultado: number | null
  proprio: boolean | null
}

export interface BalnearioDetalhe {
  codigo: string
  balneario: string
  municipio: string
  codigoMunicipio: number
  pontoNome: string
  localizacao: string
  latitude: number | null
  longitude: number | null
  analises: AnaliseOut[]
  ultimaAnalise: AnaliseOut | null
}