import '../../App.css'

import { useState } from 'react'

type ToolStatus = 'installed' | 'not-installed'

const tools = [
  {
    id: 'nginx',
    title: 'Nginx manager',
    desc: 'Placeholder for managing Nginx configs and reloads.',
    status: 'not-installed' as ToolStatus,
  },
  {
    id: 'database',
    title: 'Database',
    desc: 'Placeholder for DB connections, migrations, and backups.',
    status: 'not-installed' as ToolStatus,
  },
]

export function UtilitiesPage() {
  const [activeTool, setActiveTool] = useState<(typeof tools)[number] | null>(null)
  const [infoTool, setInfoTool] = useState<(typeof tools)[number] | null>(null)
  const [statuses, setStatuses] = useState<Record<string, ToolStatus>>(
    () =>
      tools.reduce<Record<string, ToolStatus>>((acc, tool) => {
        acc[tool.id] = tool.status
        return acc
      }, {}),
  )

  const markInstalled = (toolId: string) => {
    setStatuses((prev) => ({ ...prev, [toolId]: 'installed' }))
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Tools</p>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Utilities</h1>
        <p className="text-sm text-[var(--text-subtle)]">Quick utilities for infra management.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tools.map((tool) => {
          const status = statuses[tool.id] ?? tool.status
          const isInstalled = status === 'installed'
          const hasModal = tool.id === 'database'
          return (
            <div
              key={tool.id}
              className="glass-panel border border-[var(--border-subtle)] px-4 py-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">{tool.title}</h2>
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.35em] ${
                    isInstalled
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  Status: {isInstalled ? 'Installed' : 'Not installed'}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-subtle)]">{tool.desc}</p>
              <div className="mt-3 flex gap-2">
                <button
                  className={`rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors duration-150 ${
                    isInstalled
                      ? 'border-[var(--border-subtle)] bg-[var(--surface-button)] text-[var(--text-muted)]'
                      : 'border-[var(--border-interactive)] bg-[var(--surface-button)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                  }`}
                  onClick={() => {
                    if (isInstalled) return
                    if (hasModal) {
                      setActiveTool(tool)
                    } else {
                      markInstalled(tool.id)
                    }
                  }}
                  disabled={isInstalled}
                >
                  {isInstalled ? 'Installed' : 'Install'}
                </button>
                {isInstalled ? (
                  <button
                    className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
                    onClick={() => setInfoTool(tool)}
                  >
                    Info
                  </button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {activeTool && activeTool.id === 'database' ? (
        <InstallModal
          tool={activeTool}
          onClose={() => setActiveTool(null)}
          onInstalled={() => {
            markInstalled(activeTool.id)
            setActiveTool(null)
          }}
        />
      ) : null}

      {infoTool ? <InfoModal tool={infoTool} onClose={() => setInfoTool(null)} /> : null}
    </div>
  )
}

function InstallModal({
  tool,
  onClose,
  onInstalled,
}: {
  tool: (typeof tools)[number]
  onClose: () => void
  onInstalled: () => void
}) {
  const [dbPassword, setDbPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()_-+='
    let result = ''
    for (let i = 0; i < 16; i += 1) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    setDbPassword(result)
    setShowPassword(false)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Install</p>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{tool.title}</h2>
            <p className="text-sm text-[var(--text-subtle)]">Provide details to install and configure.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-sm text-[var(--text-secondary)] hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Database name</span>
            <input
              type="text"
              placeholder="loopa_app"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Username</span>
            <input
              type="text"
              placeholder="db_user"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Password</span>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-[12px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={generatePassword}
                className="rounded-lg border border-[var(--border-interactive)] bg-[var(--surface-button)] px-3 py-2 text-[12px] font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-strong)]"
              >
                Generate
              </button>
            </div>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-[var(--text-muted)]">Port</span>
            <input
              type="number"
              placeholder="5432"
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-interactive)] focus:outline-none"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-lg border border-[var(--border-interactive)] bg-[var(--surface-button)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-strong)]"
            onClick={onInstalled}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoModal({ tool, onClose }: { tool: (typeof tools)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Info</p>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{tool.title}</h2>
            <p className="text-sm text-[var(--text-subtle)]">Installation details placeholder.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-sm text-[var(--text-secondary)] hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60 p-3 text-sm text-[var(--text-primary)]">
          <p>- Placeholder: show installed version, path, and status here.</p>
          <p>- Placeholder: show last action log / timestamp.</p>
        </div>
      </div>
    </div>
  )
}
