import fs from 'fs/promises'
import path from 'path'
import { config } from '../config'

export type StoredUser = { username: string; passwordHash: string }
export type StoredEnv = { id: string; key: string; value: string }
export type StoredSettings = {
  sshKey?: string
  backendPort?: number
  fail2banConfig?: Record<string, unknown>
}

export type AppData = {
  setupDone: boolean
  users: StoredUser[]
  env: StoredEnv[]
  settings: StoredSettings
}

const dataFilePath = path.resolve(process.cwd(), config.dataFile)

async function ensureFile() {
  const dir = path.dirname(dataFilePath)
  await fs.mkdir(dir, { recursive: true })
  try {
    await fs.access(dataFilePath)
  } catch {
    const initial: AppData = {
      setupDone: false,
      users: [],
      env: [],
      settings: {},
    }
    await fs.writeFile(dataFilePath, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

export async function loadData(): Promise<AppData> {
  await ensureFile()
  const raw = await fs.readFile(dataFilePath, 'utf-8')
  return JSON.parse(raw) as AppData
}

export async function saveData(data: AppData): Promise<void> {
  await ensureFile()
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8')
}
