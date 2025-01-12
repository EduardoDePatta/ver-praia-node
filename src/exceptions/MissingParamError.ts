import HttpException from './HttpException'

class MissingParamError extends HttpException {
  constructor (paramName: string) {
    super(400, `Adicione o parâmetro ${paramName} para continuar.`)
    this.name = 'MissingParamError'
  }
}
export { MissingParamError }
