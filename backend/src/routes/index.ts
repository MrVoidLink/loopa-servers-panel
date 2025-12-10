import { Router } from 'express'
import { authRouter } from './auth.js'
import { envVarsRouter } from './envVars.js'
import { settingsRouter } from './settings.js'
import { setupRouter } from './setup.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/setup', setupRouter)
router.use('/env', envVarsRouter)
router.use('/settings', settingsRouter)

export { router }
