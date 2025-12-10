import dotenv from 'dotenv'

dotenv.config()

const required = (value: string | undefined, fallback: string) => value ?? fallback

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: required(process.env.CORS_ORIGIN, '*'),
  jwtSecret: required(process.env.JWT_SECRET, 'change-me'),
  dataFile: process.env.DATA_FILE ?? 'data/app.json',
}

export function validateConfig() {
  if (config.jwtSecret === 'change-me') {
    // eslint-disable-next-line no-console
    console.warn('[config] JWT_SECRET is using a default value; set a strong secret in production.')
  }
}
