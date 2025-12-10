import { StatusBadge } from './StatusBadge'

type DeployStatusProps = {
  apiStatus: 'success' | 'failed' | 'running'
  commit: string
  lastDeploy: string
}

export function DeployStatus({ apiStatus, commit, lastDeploy }: DeployStatusProps) {
  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-4 py-4 shadow-[var(--shadow-card)]">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Status</p>
      <h2 className="mt-2 text-sm font-semibold text-[var(--text-primary)]">Service health</h2>
      <div className="mt-3 space-y-2 text-sm text-[var(--text-subtle)]">
        <div className="flex items-center justify-between">
          <span>API</span>
          <StatusBadge status={apiStatus} label={apiStatus === 'success' ? 'Running' : apiStatus} />
        </div>
        <div className="flex items-center justify-between">
          <span>Commit</span>
          <span className="text-[var(--text-primary)]">{commit}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Last deploy</span>
          <span>{lastDeploy}</span>
        </div>
      </div>
    </div>
  )
}
