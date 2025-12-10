import { StatusBadge, type HistoryStatus } from './StatusBadge'

type HistoryItem = {
  id: string
  action: string
  env: string
  status: HistoryStatus
  time: string
  by: string
}

type DeployHistoryProps = {
  items: HistoryItem[]
}

export function DeployHistory({ items }: DeployHistoryProps) {
  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-4 py-4 shadow-[var(--shadow-card)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">History</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60 px-3 py-2"
          >
            <div className="flex items-center justify-between text-sm text-[var(--text-primary)]">
              <span>{item.action}</span>
              <StatusBadge status={item.status} label={item.status} />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{item.env}</span>
              <span>{item.time}</span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">By {item.by}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export type { HistoryItem }
