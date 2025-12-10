import type { JSX } from 'react'

export type SidebarIconName =
  | 'dashboard'
  | 'servers'
  | 'activity'
  | 'alerts'
  | 'reports'
  | 'sliders'
  | 'rocket'
  | 'tools'
  | 'settings'
  | 'default'

type IconProps = {
  active?: boolean
  className?: string
}

const computeColorClass = (active?: boolean) =>
  active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'

const Dashboard = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l2-7 4 14 2-7h6" />
  </svg>
)

const Servers = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <rect x="3" y="4" width="18" height="6" rx="2" />
    <rect x="3" y="14" width="18" height="6" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M11 7h.01M7 17h.01M11 17h.01" />
  </svg>
)

const Activity = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h4l2-7 4 14 2-7h4" />
  </svg>
)

const Alerts = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86 2.82 17.02A1.5 1.5 0 004.11 19.3h15.78a1.5 1.5 0 001.29-2.28L13.71 3.86a1.5 1.5 0 00-2.58 0z" />
  </svg>
)

const Reports = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20h12M9 4h6l3 4v9a3 3 0 01-3 3H9a3 3 0 01-3-3V7a3 3 0 013-3z" />
  </svg>
)

const Sliders = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h7m5 0h4M4 18h10" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="12" cy="18" r="2" />
  </svg>
)

const Rocket = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 4.5c-3 1-5.5 3.5-6.5 6.5L4 16l5-1.5c3-1 5.5-3.5 6.5-6.5L17 4l-3 .5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l-1.5-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 14c-1 1.5-1.5 3.5-1.5 5.5 1.5 0 3.5-.5 5-1.5" />
    <circle cx="15" cy="7" r="1.5" />
  </svg>
)

const Tools = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.2 4.2l3.6 3.6-2.4 2.4-2-2-2.6 2.6 4.8 4.8a2 2 0 010 2.8l-.8.8a2 2 0 01-2.8 0l-4.8-4.8-2.6 2.6-2.4-2.4 2.6-2.6-2-2 2.4-2.4 3.6 3.6"
    />
  </svg>
)

const Settings = ({ active, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={`${className ?? ''} ${computeColorClass(active)}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.757.426 1.757 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.757-2.924 1.757-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.757-.426-1.757-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.607 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

export const sidebarIconRegistry: Record<
  SidebarIconName,
  (props: IconProps) => JSX.Element
> = {
  dashboard: Dashboard,
  servers: Servers,
  activity: Activity,
  alerts: Alerts,
  reports: Reports,
  sliders: Sliders,
  rocket: Rocket,
  tools: Tools,
  settings: Settings,
  default: DefaultDot,
}

function DefaultDot({ active, className }: IconProps) {
  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${className ?? ''} ${
        active ? 'bg-[var(--text-primary)]' : 'bg-[var(--text-secondary)]'
      }`}
    />
  )
}
