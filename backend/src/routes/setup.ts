import { Router } from 'express'
import { createInitialUser } from '../services/authService.js'
import { loadData, saveData } from '../services/store.js'

const router = Router()

router.post('/', async (req, res) => {
  const { adminUser, adminPass, sshKey, backendPort, fail2banConfig } = req.body ?? {}

  if (!adminUser || !adminPass) {
    return res.status(400).json({ error: 'adminUser and adminPass are required' })
  }

  const data = await loadData()
  if (data.setupDone) {
    return res.status(409).json({ error: 'setup already completed' })
  }

  await createInitialUser(adminUser, adminPass)

  if (sshKey) data.settings.sshKey = sshKey
  if (backendPort) data.settings.backendPort = Number(backendPort)
  if (fail2banConfig) data.settings.fail2banConfig = fail2banConfig

  data.setupDone = true
  await saveData(data)

  return res.status(201).json({ ok: true })
})

router.get('/status', async (_req, res) => {
  const data = await loadData()
  res.json({ setupDone: data.setupDone })
})

export { router as setupRouter }
