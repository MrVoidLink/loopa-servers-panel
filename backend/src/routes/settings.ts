import { Router } from 'express'
import { authGuard } from '../middleware/auth'
import { loadData, saveData } from '../services/store'

const router = Router()

router.use(authGuard)

router.get('/', async (_req, res) => {
  const data = await loadData()
  const { sshKey, backendPort, fail2banConfig } = data.settings
  res.json({
    sshKey: sshKey ? 'stored' : null,
    backendPort: backendPort ?? null,
    fail2banConfig: fail2banConfig ?? null,
  })
})

router.put('/', async (req, res) => {
  const { sshKey, backendPort, fail2banConfig } = req.body ?? {}
  const data = await loadData()
  if (sshKey !== undefined) data.settings.sshKey = sshKey
  if (backendPort !== undefined) data.settings.backendPort = Number(backendPort)
  if (fail2banConfig !== undefined) data.settings.fail2banConfig = fail2banConfig
  await saveData(data)
  res.json({ ok: true })
})

export { router as settingsRouter }
