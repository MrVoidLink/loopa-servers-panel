import '../../App.css'

export function ConfigsPage() {
  return (
    <div className="glass-panel border border-[var(--border-strong)] px-4 py-5 shadow-[var(--shadow-card)] sm:px-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Configs</p>
      <h1 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">Configuration workspace</h1>
      <p className="mt-1 text-sm text-[var(--text-subtle)]">
        Placeholder area for configuration forms and settings.
      </p>
    </div>
  )
}
