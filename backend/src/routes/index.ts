import { Router } from 'express'
import { authRouter } from './auth'
import { envVarsRouter } from './envVars'
import { settingsRouter } from './settings'
import { setupRouter } from './setup'

const router = Router()

router.use('/auth', authRouter)
router.use('/setup', setupRouter)
router.use('/env', envVarsRouter)
router.use('/settings', settingsRouter)

export { router }
