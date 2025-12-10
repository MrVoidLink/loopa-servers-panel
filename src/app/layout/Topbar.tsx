import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../theme'

type TopbarProps = {
  onToggleSidebar: () => void
  onToggleCollapse: () => void
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
}

export function Topbar({
  onToggleSidebar,
  onToggleCollapse,
  isSidebarOpen,
  isSidebarCollapsed,
}: TopbarProps) {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'
  const toggleLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const iconButtonClasses =
    'flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-transparent text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive)]/60'

  return (
    <header className="relative z-30 border-b border-[var(--border-strong)] bg-[var(--surface-topbar)]/80 px-4 py-2 backdrop-blur-xl transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`${iconButtonClasses} lg:hidden`}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`hidden ${iconButtonClasses} lg:flex`}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <span className="hidden text-sm font-semibold uppercase tracking-[0.35em] text-transparent sm:inline bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text">
            Loopa Servers
          </span>
        </div>

        <div className="flex flex-1 justify-center px-2">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-[var(--text-muted)]">
              <SearchIcon />
            </span>
            <input
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] py-2 pl-9 pr-3 text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-colors duration-150 focus:border-[var(--border-interactive)] focus:outline-none"
              placeholder="Search servers, tags, regions..."
              type="search"
              aria-label="Global search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMode}
            className={iconButtonClasses}
            aria-label={toggleLabel}
            aria-pressed={mode === 'light'}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <button type="button" className={iconButtonClasses} aria-label="Notifications">
            <BellIcon />
          </button>
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-button)] text-[var(--text-primary)] transition-colors duration-150 hover:border-[var(--border-interactive)] ${
                isUserMenuOpen ? 'ring-2 ring-[var(--border-interactive)]/60' : ''
              }`}
              aria-label="Account menu"
              title="SRE session"
            >
              <UserIcon />
            </button>
            {isUserMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3 text-sm shadow-2xl">
                <div className="space-y-1 border-b border-[var(--border-subtle)] pb-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Session</p>
                  <p className="font-semibold text-[var(--text-primary)]">ops@loopa</p>
                  <p className="text-xs text-[var(--text-subtle)]">SRE</p>
                </div>
                <div className="pt-3 space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
                  >
                    View account
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors duration-150 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)]"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 015.5 5.5 5.5 5.5 0 11-11 0A5.5 5.5 0 019 3.5zm6.032 10.79a7 7 0 11-1.061-1.06l3.094 3.094a.75.75 0 11-1.06 1.06l-2.973-3.094z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364 6.364-1.06-1.06M6.696 6.696 5.636 5.636m12.728 0-1.06 1.06M6.696 17.304l-1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.885 21a1.5 1.5 0 01-5.77 0M12 5.25A4.5 4.5 0 007.5 9.75c0 4.401-1.263 5.31-2.17 6.221-.35.35-.505.6-.41.93.08.27.332.599.83.599h12.5c.498 0 .75-.329.83-.6.095-.33-.06-.58-.41-.93-.908-.91-2.17-1.82-2.17-6.22A4.5 4.5 0 0012 5.25z"
      />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.79 4.21a.75.75 0 0 1 0 1.06L8.56 9.5l4.23 4.23a.75.75 0 1 1-1.06 1.06l-4.76-4.75a.75.75 0 0 1 0-1.06l4.76-4.77a.75.75 0 0 1 1.06 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.21 4.21a.75.75 0 0 0 0 1.06L11.44 9.5l-4.23 4.23a.75.75 0 0 0 1.06 1.06l4.76-4.75a.75.75 0 0 0 0-1.06l-4.76-4.77a.75.75 0 0 0-1.06 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 20.25a7.5 7.5 0 0115 0"
      />
    </svg>
  )
}
