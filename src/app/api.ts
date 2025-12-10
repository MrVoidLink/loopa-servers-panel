const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  return (await res.json()) as T
}

export async function loginRequest(username: string, password: string) {
  return apiFetch<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function setupStatusRequest() {
  return apiFetch<{ setupDone: boolean }>('/setup/status')
}

export type SetupPayload = {
  adminUser: string
  adminPass: string
  adminName?: string
  sshKey?: string
  backendPort?: number
  fail2banConfig?: Record<string, unknown>
}

export async function setupSubmitRequest(payload: SetupPayload) {
  return apiFetch<{ ok: true }>('/setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
