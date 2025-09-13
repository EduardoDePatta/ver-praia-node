import cron from 'node-cron'
import axios, { AxiosError } from 'axios'
import environments from './environments'

export function initializeCronJobs() {
  cron.schedule('0 0,12 * * *', async () => {
    console.log(`[Cron Job] Starting POST /api/v1/balneabilidade at ${new Date().toISOString()}`)
    try {
      await axios.post(`${environments.API_URL}/api/v1/balneabilidade`, null, {
        auth: {
          password: environments.BASIC_AUTH_PASSWORD,
          username: environments.BASIC_AUTH_USERNAME
        }
      })
      console.log(`[Cron Job] Success!`)
    } catch (error) {
      console.log('🚀 ~ cron.schedule ~ error:', error)
      if (error instanceof AxiosError) {
        console.error(`[Cron Job] Error: ${error.request.data.message}`)
      } else if (error instanceof Error) {
        console.error(`[Cron Job] Error: ${error.message}`)
      } else {
        console.error('[Cron Job] Error: ', error)
      }
    }
  })

  console.log('[Cron Job] Initialized cron jobs.')
}
