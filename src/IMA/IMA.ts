import axios, { AxiosInstance } from 'axios'
import environments from '../environments'
import { PontoAnalise } from '../apis/v1/controller/balneabilidade/interfaces'

interface IIMA {
  getBalneabilidade(): Promise<PontoAnalise[]>
}

class IMA implements IIMA {
  private apiClient: AxiosInstance

  constructor() {
    this.apiClient = axios.create({
      baseURL: environments.IMA_URL,
      headers: {
        Origin: 'https://balneabilidade.ima.sc.gov.br'
      }
    })
  }

  public async getBalneabilidade(): Promise<PontoAnalise[]> {
    try {
      const response = await this.apiClient.get<PontoAnalise[]>('/')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export { IMA }
