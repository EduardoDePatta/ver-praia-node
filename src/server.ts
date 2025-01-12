import environments from './environments'
import app from '.'
import db from './db'
import { initializeCronJobs } from './cronJobs'

process.on('uncaughtException', (error: Error) => {
  console.log(`Error: ${error}\nShutting down...`)
  process.exit(1)
})

async function testDBConnection() {
  try {
    const { now } = await db.one('SELECT NOW()')
    console.log('Database connection established successfully.', now)
  } catch (error) {
    console.error('Failed to connect to the database.')
    process.exit(1)
  }
}

testDBConnection().then(() => {
  app.listen(environments.PORT, () => {
    console.log(`Server running on port ${environments.PORT}`)
    initializeCronJobs()
  })
})
