import { randomUUID } from 'crypto'
import { Router } from 'express'
import { authGuard } from '../middleware/auth'
import { loadData, saveData } from '../services/store'

const router = Router()

router.use(authGuard)

router.get('/', async (_req, res) => {
  const data = await loadData()
  res.json({ items: data.env })
})

router.post('/', async (req, res) => {
  const { key, value } = req.body ?? {}
  if (!key || !value) {
    return res.status(400).json({ error: 'key and value are required' })
  }
  const data = await loadData()
  const existing = data.env.find((env) => env.key === key)
  if (existing) {
    existing.value = value
    await saveData(data)
    return res.json(existing)
  }
  const id = randomUUID()
  const item = { id, key, value }
  data.env.push(item)
  await saveData(data)
  return res.status(201).json(item)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const data = await loadData()
  const index = data.env.findIndex((env) => env.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'not found' })
  }
  const [removed] = data.env.splice(index, 1)
  await saveData(data)
  return res.json(removed)
})

export { router as envVarsRouter }
