import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config, validateConfig } from './config.js'
import { router as api } from './routes/index.js'

validateConfig()

const app = express()
app.use(helmet())
app.use(
  cors({
    origin: config.corsOrigin,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.use('/api', api)

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on http://localhost:${config.port}`)
  })
}

export { app }
