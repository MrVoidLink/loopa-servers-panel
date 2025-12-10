type HistoryStatus = 'success' | 'failed' | 'running'

export function StatusBadge({ status, label }: { status: HistoryStatus; label: string }) {
  const tones: Record<HistoryStatus, string> = {
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    failed: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
    running: 'bg-indigo-500/15 text-indigo-200 border border-indigo-500/25',
  }
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.35em] ${tones[status]}`}>
      {label}
    </span>
  )
}

export type { HistoryStatus }
