import HttpException from './HttpException'

class ExtraParamError extends HttpException {
  constructor (paramName: string) {
    super(400, `Parâmetro não identificado: ${paramName}`)
    this.name = 'ExtraParamError'
  }
}
export { ExtraParamError }
