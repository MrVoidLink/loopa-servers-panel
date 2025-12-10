import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { setupStatusRequest } from '../api'

export function RequireSetup() {
  const location = useLocation()
  const [setupDone, setSetupDone] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await setupStatusRequest()
        setSetupDone(res.setupDone)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify setup')
      }
    })()
  }, [])

  if (setupDone === null && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-root)] text-[var(--text-primary)]">
        Checking setup...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--surface-root)] text-[var(--text-primary)]">
        <p className="text-sm">Setup status unavailable: {error}</p>
        <p className="text-xs text-[var(--text-muted)]">Ensure backend is running and reachable.</p>
      </div>
    )
  }

  if (setupDone === false) {
    if (location.pathname !== '/setup') {
      return <Navigate to="/setup" replace />
    }
  } else if (setupDone === true && location.pathname === '/setup') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
