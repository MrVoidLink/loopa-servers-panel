import rateLimit from 'express-rate-limit'
import { Router } from 'express'
import { authGuard, type AuthedRequest } from '../middleware/auth.js'
import { issueToken, verifyCredentials } from '../services/authService.js'
import { loadData } from '../services/store.js'

const router = Router()

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
})

router.post('/login', limiter, async (req, res) => {
  const { username, password } = req.body ?? {}
  if (!username || !password) return res.status(400).json({ error: 'missing credentials' })

  const ok = await verifyCredentials(username, password)
  if (!ok) return res.status(401).json({ error: 'invalid credentials' })

  const token = issueToken(username)
  return res.json({ token })
})

router.get('/me', authGuard, async (req, res) => {
  const authed = req as AuthedRequest
  const data = await loadData()
  const user = data.users.find((u) => u.username === authed.user?.username)
  if (!user) return res.status(404).json({ error: 'user not found' })
  return res.json({ username: user.username })
})

export { router as authRouter }
