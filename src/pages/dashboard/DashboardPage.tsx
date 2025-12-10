import "../../App.css"

export function DashboardPage() {
  return (
    <div className="space-y-3">
      <h1 className="sr-only">Dashboard</h1>
      <div
        className="grid auto-rows-auto items-start gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
      >
        <MetricCard title="CPU" rows={['Usage: 24%', 'Load: 0.42 / 0.37 / 0.30']} chartValue={24} />
        <MetricCard title="RAM" rows={['Total: 16 GB', 'Used: 8.2 GB', 'Free: 7.8 GB']} chartValue={51} />
        <MetricCard title="Disk" rows={['Usage: 61%', 'Free: 120 GB', 'Inodes: 12%']} chartValue={61} />
        <MetricCard title="Network" rows={['Up: 120 Mbps', 'Down: 340 Mbps', 'Drops: 0.02%']} />
        <MetricCard title="Top processes" rows={['node (18%)', 'postgres (12%)', 'nginx (4%)']} />
        <MetricCard title="System" rows={['Uptime: 4d 12h', 'OS: Ubuntu 22.04', 'Kernel: 6.5.x']} />
        <MetricCard title="Security" rows={['fail2ban: active', 'SSH attempts: 3 / 24h']} />
        <MetricCard title="Alerts" rows={['Warnings: 1', 'Critical: 0']} />
      </div>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'stretch' }}
      >
        <XrayMonitorCard />
        <ServicesPanel />
      </div>
    </div>
  )
}

function MetricCard({ title, rows, chartValue }: { title: string; rows: string[]; chartValue?: number }) {
  return (
    <div className="glass-panel h-full min-h-[140px] border border-[var(--border-subtle)] px-3 py-3 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
          <div className="mt-2 grid gap-1 text-xs text-[var(--text-secondary)]">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--indicator-muted)]" />
                <span className="truncate">{row}</span>
              </div>
            ))}
          </div>
        </div>
        {typeof chartValue === 'number' ? <Donut value={chartValue} /> : null}
      </div>
    </div>
  )
}

function XrayMonitorCard() {
  const rows = [
    { label: 'Active now', desc: 'Users currently connected', value: '7' },
    { label: 'Users last 12h', desc: 'Unique users with at least one session', value: '24' },
    { label: 'Live traffic (Up)', desc: 'Current upstream throughput', value: '12.3 Mbps' },
    { label: 'Live traffic (Down)', desc: 'Current downstream throughput', value: '48.7 Mbps' },
  ]

  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-3 py-3 shadow-[var(--shadow-card)] sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Xray</p>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Live monitoring</h2>
          <p className="text-xs text-[var(--text-subtle)]">Sessions and bandwidth in real time.</p>
        </div>
        <div className="rounded-full border border-[var(--border-subtle)] px-2 py-1 text-[11px] text-[var(--text-secondary)]">
          <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Realtime feed
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)]/60">
        <table className="w-full text-sm text-[var(--text-secondary)]">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-[var(--border-subtle)] last:border-none">
                <td className="px-3 py-2">
                  <div className="text-[13px] font-semibold text-[var(--text-primary)]">{row.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{row.desc}</div>
                </td>
                <td className="px-3 py-2 text-right text-[var(--text-primary)]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ServicesPanel() {
  const services = [
    { name: 'API Gateway', status: 'operational', latency: '142ms', uptime: '99.97%', tone: 'healthy' },
    { name: 'Web App', status: 'degraded', latency: '310ms', uptime: '99.82%', tone: 'warning' },
    { name: 'PostgreSQL', status: 'restarting', latency: 'n/a', uptime: '98.5%', tone: 'critical' },
    { name: 'Redis', status: 'operational', latency: '9ms', uptime: '100%', tone: 'healthy' },
    { name: 'Edge CDN', status: 'operational', latency: '44ms', uptime: '99.99%', tone: 'healthy' },
    { name: 'SSH Bastion', status: 'locked down', latency: 'n/a', uptime: '99.9%', tone: 'info' },
  ] as const

  return (
    <div className="glass-panel border border-[var(--border-subtle)] px-3 py-3 shadow-[var(--shadow-card)] sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Services</p>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Live estate</h2>
          <p className="text-xs text-[var(--text-subtle)]">Status, latency, and uptime at a glance.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--surface-button)] px-2 py-1 text-[11px] text-[var(--text-subtle)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Auto-refresh: 30s
        </div>
      </div>

      <div
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', alignItems: 'stretch' }}
      >
        {services.map((svc) => {
          const tone = getTone(svc.tone)
          return (
            <div
              key={svc.name}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-button)] px-3 py-2.5 transition-colors duration-150 hover:border-[var(--border-strong)]"
            >
              <div className="flex items-center justify-between gap-2 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.dot }} />
                  <div>
                    <div className="text-[var(--text-primary)] font-semibold">{svc.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Latency: {svc.latency} · Uptime: {svc.uptime}
                    </div>
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-[3px] text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ background: tone.pillBg, color: tone.pillText, border: `1px solid ${tone.pillBorder}` }}
                >
                  {svc.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getTone(tone: 'healthy' | 'warning' | 'critical' | 'info') {
  if (tone === 'healthy')
    return {
      dot: '#34d399',
      pillBg: 'rgba(52, 211, 153, 0.12)',
      pillText: '#34d399',
      pillBorder: 'rgba(52, 211, 153, 0.3)',
    }
  if (tone === 'warning')
    return {
      dot: '#fbbf24',
      pillBg: 'rgba(251, 191, 36, 0.12)',
      pillText: '#fbbf24',
      pillBorder: 'rgba(251, 191, 36, 0.3)',
    }
  if (tone === 'critical')
    return {
      dot: '#f87171',
      pillBg: 'rgba(248, 113, 113, 0.12)',
      pillText: '#f87171',
      pillBorder: 'rgba(248, 113, 113, 0.3)',
    }
  return {
    dot: '#cbd5e1',
    pillBg: 'rgba(148, 163, 184, 0.12)',
    pillText: '#cbd5e1',
    pillBorder: 'rgba(148, 163, 184, 0.3)',
  }
}

function Donut({ value }: { value: number }) {
  const radius = 12
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 32 32">
        <circle
          className="text-[var(--border-subtle)]"
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="16"
          cy="16"
        />
        <circle
          className="text-[var(--border-interactive)]"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="16"
          cy="16"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[10px] font-semibold text-[var(--text-primary)]">{clamped}%</span>
    </div>
  )
}
