type DeployLogsProps = {
  lines: string[]
}

export function DeployLogs({ lines }: DeployLogsProps) {
  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-4 py-4 shadow-[var(--shadow-card)] lg:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Deploy log</h3>
        <a className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]" href="#">
          View full log
        </a>
      </div>
      <div className="mt-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60 px-3 py-3 font-mono text-[12px] text-[var(--text-primary)]">
        {lines.map((line) => (
          <div key={line} className="truncate">
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
