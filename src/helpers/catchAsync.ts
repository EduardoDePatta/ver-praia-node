import { NextFunction } from 'express'
import { HTTP } from './HttpRequest'
import db from '../db'

type AsyncFunction<T> = (req: HTTP.Req, tx?: any) => Promise<{ status: number; message: string; data?: T }>

export const catchAsync = <T>(fn: AsyncFunction<T>, useTransaction: boolean = false) => {
  return async (req: HTTP.Req, res: HTTP.Res<T>, next: NextFunction) => {
    try {
      if (useTransaction) {
        await db.tx(async (tx) => {
          const { status, message, data } = await fn(req, tx)
          res.status(status).json({ message, data })
        })
      } else {
        const { status, message, data } = await fn(req)
        res.status(status).json({ message, data })
      }
    } catch (error) {
      console.log('🚀 ~ return ~ error:', error)
      next(error)
    }
  }
}
