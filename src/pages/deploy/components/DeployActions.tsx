import { StatusBadge } from './StatusBadge'

type DeployActionsProps = {
  branches: string[]
  onBranchChange?: (branch: string) => void
}

const actions = ['Pull latest', 'Install packages', 'Build', 'Deploy', 'Restart service', 'Cancel']

export function DeployActions({ branches, onBranchChange }: DeployActionsProps) {
  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-4 py-4 shadow-[var(--shadow-card)] lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Actions</p>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Pull & deploy</h2>
        </div>
        <select
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] px-3 py-2 text-sm text-[var(--text-primary)]"
          onChange={(e) => onBranchChange?.(e.target.value)}
        >
          {branches.map((branch) => (
            <option key={branch}>{branch}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((label) => (
          <ActionButton key={label} label={label} tone={label === 'Deploy' ? 'primary' : undefined} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60 px-3 py-2 text-sm text-[var(--text-subtle)]">
        <span>Last action</span>
        <div className="flex items-center gap-2">
          <StatusBadge status="success" label="ok" />
          <span className="text-[var(--text-primary)]">Pull main · 5m ago</span>
        </div>
      </div>
    </div>
  )
}

function ActionButton({ label, tone }: { label: string; tone?: 'primary' }) {
  const primary = tone === 'primary'
  return (
    <button
      type="button"
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
        primary
          ? 'border-[var(--border-interactive)] bg-[var(--surface-button)] text-[var(--text-primary)] hover:border-[var(--border-strong)]'
          : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]'
      }`}
    >
      {label}
    </button>
  )
}
