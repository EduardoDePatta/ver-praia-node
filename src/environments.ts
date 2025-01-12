const dotenv = require('dotenv')
dotenv.config()

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_DATABASE: process.env.DB_DATABASE || '',
  DB_PASSWORD: String(process.env.DB_PASSWORD) || '',
  DB_PORT: Number(process.env.DB_PORT) ?? 5432,
  PORT: Number(process.env.PORT) ?? 5000,
  APP_SECRET: process.env.APP_SECRET || '',
  BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME || '',
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || '',
  IMA_URL: process.env.IMA_URL || '',
  API_URL: process.env.API_URL || ''
}
