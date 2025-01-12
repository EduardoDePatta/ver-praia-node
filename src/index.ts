import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import environments from './environments'
import { HttpException } from './exceptions'
import errorMiddleware from './middlewares/errorMiddleware'
import { routerV1 } from './apis/v1'

const app = express()

app.use(cors())

app.use(express.json({ limit: '40kb' }))
app.use(express.urlencoded({ extended: false, limit: '40kb ' }))

if (environments.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.use('/api/v1', routerV1)

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new HttpException(500, `Can't find ${req.originalUrl} on this server!`))
})

app.use(errorMiddleware)

export default app
