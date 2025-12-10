import { useState } from 'react'
import '../../App.css'

type EnvVar = {
  id: string
  key: string
  value: string
}

export function SettingsPage() {
  return (
    <div className="space-y-3">
      <h1 className="sr-only">Settings</h1>
      <EnvironmentVariables />
    </div>
  )
}

function EnvironmentVariables() {
  const [envs, setEnvs] = useState<EnvVar[]>([
    { id: '1', key: 'API_BASE_URL', value: 'https://api.loopa.dev' },
    { id: '2', key: 'FEATURE_FLAGS', value: 'beta-dashboard' },
  ])
  const [draft, setDraft] = useState<{ key: string; value: string }>({
    key: '',
    value: '',
  })
  const [open, setOpen] = useState(false)

  const handleAdd = () => {
    if (!draft.key.trim() || !draft.value.trim()) return
    setEnvs((prev) => [...prev, { id: crypto.randomUUID(), key: draft.key.trim(), value: draft.value.trim() }])
    setDraft({ key: '', value: '' })
  }

  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-3 py-3 shadow-[var(--shadow-card)] sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Settings</p>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Environment variables</h2>
          <p className="text-xs text-[var(--text-subtle)]">Key/value only; minimal footprint with no scopes.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[var(--border-subtle)] px-2 py-1 text-[11px] text-[var(--text-muted)]">
            Envs: {envs.length}
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-5 sm:items-center">
        <input
          value={draft.key}
          onChange={(e) => setDraft((d) => ({ ...d, key: e.target.value }))}
          placeholder="KEY"
          className="sm:col-span-2 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
        />
        <input
          value={draft.value}
          onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
          placeholder="VALUE"
          className="sm:col-span-2 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
        />
        <div className="flex gap-2 sm:col-span-1 sm:justify-end">
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md border border-[var(--border-subtle)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-interactive)]"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 rounded-md border border-[var(--border-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-interactive)]"
        >
          <span className="text-[var(--text-secondary)]">{open ? 'Hide list' : 'Show list'}</span>
          <span className={`transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}>⌄</span>
        </button>
      </div>

      {open ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60">
          <table className="w-full text-sm text-[var(--text-secondary)]">
            <thead className="bg-[var(--surface-hover)] text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Key</th>
                <th className="px-3 py-2 text-left font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {envs.map((env) => (
                <tr key={env.id} className="border-t border-[var(--border-subtle)]">
                  <td className="px-3 py-2 font-semibold text-[var(--text-primary)]">{env.key}</td>
                  <td className="px-3 py-2 text-[var(--text-secondary)]">{env.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
