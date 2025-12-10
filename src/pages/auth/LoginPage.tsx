import "../../App.css"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { loginRequest, setupStatusRequest } from "../../app/api"
import { setToken } from "../../app/auth/auth"

const highlights = [
  "Scoped access to Servers Panel",
  "Audit-ready sessions",
  "SSO-friendly layout",
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSetup, setCheckingSetup] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await loginRequest(username, password)
      setToken(res.token)
      const target = (location.state as { from?: string } | null)?.from ?? "/dashboard"
      navigate(target, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const res = await setupStatusRequest()
        if (!res.setupDone) {
          navigate("/setup", { replace: true })
          return
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify setup")
      } finally {
        setCheckingSetup(false)
      }
    })()
  }, [navigate])

  if (checkingSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-root)] text-[var(--text-primary)]">
        Checking setup...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-black via-[#050505] to-[#0c0c0c] text-[var(--text-primary)] lg:flex-row lg:items-stretch">
      <section className="flex flex-1 flex-col justify-center gap-6 px-6 py-10 sm:px-10">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--text-muted)]">Loopa Platform</p>
          <h1 className="text-4xl font-semibold">Servers control</h1>
          <p className="text-sm text-[var(--text-subtle)]">
            Sign in with your operator account. Sessions are scoped and logged for changes to the servers panel.
          </p>
        </div>
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          {highlights.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="relative flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent lg:block" />
        <div className="relative z-10 w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Sign in</p>
            <h2 className="text-2xl font-semibold">Servers Panel</h2>
          </div>
          <form
            className="space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)]/80 p-6 shadow-[var(--shadow-card)]"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="username" className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="ops"
                className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--border-subtle)] bg-transparent accent-[var(--text-primary)]"
                />
                Remember device
              </label>
              <button type="button" className="text-[var(--text-secondary)] underline underline-offset-4">
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Continue"}
            </button>
          </form>
          {error ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/70 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          ) : null}
          <div className="rounded-lg border border-[var(--border-subtle)] px-4 py-3 text-xs text-[var(--text-muted)]">
            Need help?{" "}
            <a href="mailto:security@loopa.dev" className="text-[var(--text-secondary)] underline underline-offset-2">
              Contact security
            </a>
            .
          </div>
        </div>
      </section>
    </div>
  )
}
