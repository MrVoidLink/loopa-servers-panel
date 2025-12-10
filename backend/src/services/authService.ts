import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { loadData, saveData, StoredUser } from './store'

export type JwtPayload = { username: string }

export async function createInitialUser(username: string, password: string) {
  const data = await loadData()
  if (data.users.some((u) => u.username === username)) {
    return
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user: StoredUser = { username, passwordHash }
  data.users.push(user)
  await saveData(data)
}

export async function verifyCredentials(username: string, password: string) {
  const data = await loadData()
  const user = data.users.find((u) => u.username === username)
  if (!user) return false
  const ok = await bcrypt.compare(password, user.passwordHash)
  return ok
}

export function issueToken(username: string) {
  const payload: JwtPayload = { username }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '12h' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as JwtPayload
  } catch {
    return null
  }
}
