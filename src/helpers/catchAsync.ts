import { NextFunction } from 'express'
import { HTTP } from './HttpRequest'
import db from '../db'

type AsyncFunction<T> = (req: HTTP.Req, tx?: any) => Promise<T>

export const catchAsync = <T>(fn: AsyncFunction<T>, useTransaction: boolean = false) => {
  return async (req: HTTP.Req, res: HTTP.Res<T>, next: NextFunction) => {
    try {
      if (useTransaction) {
        await db.tx(async (tx) => {
          const data = await fn(req, tx)
          res.status(200).json(data)
        })
      } else {
        const data = await fn(req)
        res.status(200).json(data)
      }
    } catch (error) {
      console.error('🚀 ~ return ~ error:', error)
      next(error)
    }
  }
}
