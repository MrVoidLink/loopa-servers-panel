import "../../App.css"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { setupStatusRequest, setupSubmitRequest } from "../../app/api"

export function SetupPage() {
  const navigate = useNavigate()
  const [setupDone, setSetupDone] = useState<boolean | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)

  const [adminName, setAdminName] = useState("")
  const [adminUser, setAdminUser] = useState("")
  const [adminPass, setAdminPass] = useState("")
  const [sshPort, setSshPort] = useState("")
  const [sshKey, setSshKey] = useState("")
  const [enableFail2Ban, setEnableFail2Ban] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [healthLog, setHealthLog] = useState<string[]>([
    "- Admin credentials pending apply",
    "- SSH port change pending",
    "- Public key validation pending",
    "- fail2ban status pending",
  ])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await setupStatusRequest()
        setSetupDone(res.setupDone)
      } catch (err) {
        setStatusError(err instanceof Error ? err.message : "Failed to load status")
      }
    })()
  }, [])

  const canSubmit = useMemo(
    () => adminUser.trim().length > 0 && adminPass.trim().length > 0 && !submitting,
    [adminUser, adminPass, submitting],
  )

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError(null)
    setSubmitting(true)
    try {
      await setupSubmitRequest({
        adminUser: adminUser.trim(),
        adminPass: adminPass.trim(),
        adminName: adminName.trim() || undefined,
        sshKey: sshKey.trim() || undefined,
        backendPort: sshPort ? Number(sshPort) : undefined,
        fail2banConfig: enableFail2Ban ? { ssh: true } : undefined,
      })
      setHealthLog((prev) => ["- Setup applied", ...prev])
      setSetupDone(true)
      navigate("/login", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed")
    } finally {
      setSubmitting(false)
    }
  }

  if (setupDone === null && !statusError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-root)] text-[var(--text-primary)]">
        Checking setup status...
      </div>
    )
  }

  if (setupDone) {
    navigate("/login", { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--surface-root)] px-4 py-10 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="flex h-full w-full flex-col gap-5">
        <header className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Setup</p>
          <h1 className="text-2xl font-semibold">First-time configuration</h1>
          <p className="text-sm text-[var(--text-subtle)]">
            Minimal fields to bring the panel up. More steps will be added later.
          </p>
          {statusError ? (
            <p className="text-xs text-red-300">Status error: {statusError}</p>
          ) : null}
        </header>

        <main className="flex-1">
          <section className="glass-panel border border-[var(--border-subtle)] px-4 py-5 shadow-[var(--shadow-card)] sm:px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Core</p>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Admin identity</h2>
              </div>
              <span className="text-xs text-[var(--text-muted)]">Required</span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <FormField label="Admin name">
                <input
                  id="adminName"
                  name="adminName"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Primary admin"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
                />
              </FormField>
              <FormField label="Admin user">
                <input
                  id="adminUser"
                  name="adminUser"
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="ops"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
                />
              </FormField>
              <FormField label="Admin password">
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
                />
              </FormField>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Access</p>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Disable password login &amp; enable SSH key authentication
                </h2>
              </div>
              <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-xs text-[var(--text-muted)]">
                Target root port: {sshPort || "22"}
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <FormField label="Change SSH port (optional)">
                <input
                  id="sshPort"
                  name="sshPort"
                  type="number"
                  min={1}
                  max={65535}
                  value={sshPort}
                  onChange={(e) => setSshPort(e.target.value)}
                  placeholder="Current: 22"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
                />
              </FormField>
            </div>

            <div className="mt-3">
              <FormField label="Root public key (ssh-rsa / ssh-ed25519)">
                <textarea
                  id="rootPublicKey"
                  name="rootPublicKey"
                  rows={3}
                  value={sshKey}
                  onChange={(e) => setSshKey(e.target.value)}
                  placeholder="ssh-ed25519 AAAAC3Nz... user@host"
                  className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
                />
              </FormField>
            </div>

            <div className="mt-3 sm:mt-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Fail2ban</div>
              <div className="sm:col-span-2 grid gap-2 text-sm text-[var(--text-subtle)]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[var(--border-subtle)] bg-transparent accent-[var(--text-primary)]"
                    checked={enableFail2Ban}
                    onChange={(e) => setEnableFail2Ban(e.target.checked)}
                  />
                  Enable fail2ban for SSH root port
                </label>
                <p className="text-xs text-[var(--text-muted)]">
                  Blocks repeated failed logins on the configured SSH port.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="rounded-lg border border-[var(--border-interactive)] bg-[var(--surface-button)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-strong)] disabled:opacity-60"
              >
                {submitting ? "Applying…" : "Apply changes"}
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
              >
                Run health check
              </button>
              <button
                type="button"
                disabled={!setupDone}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                  setupDone
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-100 hover:border-emerald-400"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] opacity-60"
                }`}
              >
                Go to panel
              </button>
            </div>

            {error ? (
              <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-red-900/30 px-3 py-2 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60 px-3 py-3 font-mono text-[12px] text-[var(--text-primary)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Health log</p>
              <div className="mt-2 space-y-1 text-[var(--text-primary)]">
                {healthLog.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  )
}
