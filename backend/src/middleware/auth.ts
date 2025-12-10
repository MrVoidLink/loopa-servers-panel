import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/authService.js'

export type AuthedRequest = Request & { user?: { username: string } }

export function authGuard(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: 'missing token' })
  }
  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'invalid token' })
  }
  req.user = { username: payload.username }
  return next()
}
