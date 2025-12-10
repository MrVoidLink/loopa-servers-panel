import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarIconRegistry, type SidebarIconName } from './iconRegistry'

export type SidebarNavItem = {
  id: string
  label: string
  to: string
  icon?: SidebarIconName
  badge?: string
  highlighted?: boolean
  children?: SidebarNavItem[]
}

export type SidebarSectionConfig = {
  id: string
  title?: string
  items: SidebarNavItem[]
}

type SidebarProps = {
  sections?: SidebarSectionConfig[]
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onExpandRequest?: () => void
}

const defaultSections: SidebarSectionConfig[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'configs',
        label: 'Configs',
        to: '/configs',
        icon: 'sliders',
      },
      {
        id: 'deploy',
        label: 'Deploy',
        to: '/deploy',
        icon: 'rocket',
      },
      {
        id: 'utilities',
        label: 'Utilities',
        to: '/utilities',
        icon: 'tools',
      },
      {
        id: 'settings',
        label: 'Settings',
        to: '/settings',
        icon: 'settings',
      },
    ],
  },
]

export function Sidebar({
  sections = defaultSections,
  isOpen,
  onClose,
  isCollapsed,
  onExpandRequest,
}: SidebarProps) {
  const widthClass = isCollapsed
    ? 'w-60 px-3 lg:w-[58px] lg:px-1.5'
    : 'w-60 px-3 lg:w-60 lg:px-3'

  return (
    <>
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ backgroundColor: 'var(--surface-overlay)' }}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex ${widthClass} flex-col overflow-hidden border-r border-[var(--border-strong)] bg-[var(--surface-sidebar)]/95 pb-5 pt-5 transition-all duration-300 lg:static lg:z-auto lg:h-screen lg:translate-x-0 lg:transition-[width,padding] lg:duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--surface-sidebar)' }}
      >
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] text-xs font-semibold uppercase tracking-[0.35em] bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-300 text-black">
              LP
            </span>
            <div className={isCollapsed ? 'lg:hidden' : ''}>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--text-muted)]">
                Servers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors duration-200 hover:border-[var(--border-interactive)] hover:text-[var(--text-primary)] lg:hidden"
            aria-label="Close sidebar"
          >
            <span className="text-base leading-none">&times;</span>
          </button>
        </div>

        <div className="mt-5 flex flex-1 flex-col overflow-hidden">
          <nav className="flex-1 space-y-4 overflow-y-auto pr-1 lg:pr-1.5 min-h-0">
            {sections.map((section) => (
              <SidebarSection
                key={section.id}
                section={section}
                isCollapsed={isCollapsed}
                onExpandRequest={onExpandRequest}
              />
            ))}
          </nav>

          <SidebarFooter isCollapsed={isCollapsed} />
        </div>
      </aside>
    </>
  )
}

type SidebarSectionProps = {
  section: SidebarSectionConfig
  isCollapsed: boolean
  onExpandRequest?: () => void
}

function SidebarSection({ section, isCollapsed, onExpandRequest }: SidebarSectionProps) {
  if (!section.items.length) {
    return null
  }

  return (
    <div>
      {section.title ? (
        <p
          className={`px-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[var(--text-muted)] transition-colors duration-200 ${
            isCollapsed ? 'lg:hidden' : ''
          }`}
        >
          {section.title}
        </p>
      ) : null}
      <ul className="mt-2.5 space-y-1">
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            onExpandRequest={onExpandRequest}
          />
        ))}
      </ul>
    </div>
  )
}

type SidebarItemProps = {
  item: SidebarNavItem
  isCollapsed: boolean
  onExpandRequest?: () => void
}

function SidebarItem({ item, isCollapsed, onExpandRequest }: SidebarItemProps) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0
  if (hasChildren) {
    return (
      <SidebarItemWithChildren
        item={item}
        isCollapsed={isCollapsed}
        onExpandRequest={onExpandRequest}
      />
    )
  }

  return <SidebarLeaf item={item} isCollapsed={isCollapsed} />
}

function SidebarItemWithChildren({
  item,
  isCollapsed,
  onExpandRequest,
}: SidebarItemProps) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const childItems = item.children ?? []
  const normalizedLocation = normalizePath(location.pathname)
  const hasActiveChild = childItems.some((child) => {
    const target = normalizePath(child.to)
    return normalizedLocation === target || normalizedLocation.startsWith(`${target}/`)
  })
  const iconKey = item.icon ?? 'default'
  const Icon = sidebarIconRegistry[iconKey] ?? sidebarIconRegistry.default
  const showChildren = !isCollapsed && open
  const isActive = hasActiveChild || showChildren

  useEffect(() => {
    if (isCollapsed) {
      setOpen(false)
      return
    }
    if (hasActiveChild) {
      setOpen(true)
    }
  }, [isCollapsed, hasActiveChild])

  const handleToggle = () => {
    if (isCollapsed) {
      onExpandRequest?.()
      setOpen(true)
      return
    }
    setOpen((prev) => !prev)
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleToggle}
        className={`group flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition-colors duration-150 ${
          isActive
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isActive ? 'bg-[var(--text-primary)]' : 'bg-[var(--indicator-muted)]'
          } ${isCollapsed ? 'lg:hidden' : ''}`}
        />
        <span
          className={`${
            isCollapsed ? 'flex' : 'hidden'
          } h-5 w-5 items-center justify-center text-[var(--text-secondary)]`}
        >
          <Icon active={isActive} className="h-3.5 w-3.5" />
        </span>
        <span className={`flex-1 ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
        <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>
          <svg
            className={`h-3 w-3 text-[var(--text-muted)] transition-transform duration-150 ${
              showChildren ? 'rotate-90' : 'rotate-0'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </button>
      {childItems.length > 0 && (
        <ul className={`ml-6 mt-1 space-y-1 border-l border-[var(--border-subtle)] pl-3 ${showChildren ? 'block' : 'hidden'}`}>
          {childItems.map((child) => (
            <SidebarLeaf key={child.id} item={child} isCollapsed={false} />
          ))}
        </ul>
      )}
    </li>
  )
}

function SidebarLeaf({ item, isCollapsed }: Omit<SidebarItemProps, 'onExpandRequest'>) {
  const iconKey = item.icon ?? 'default'
  const Icon = sidebarIconRegistry[iconKey] ?? sidebarIconRegistry.default

  return (
    <li>
      <NavLink
        to={item.to}
        end
        title={item.label}
        className={({ isActive }) =>
          [
            'group flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] transition-colors duration-150',
            isActive || item.highlighted
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            isCollapsed ? 'justify-center lg:px-1.5' : '',
          ].join(' ')
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive || item.highlighted ? 'bg-[var(--text-primary)]' : 'bg-[var(--indicator-muted)]'
              } ${isCollapsed ? 'lg:hidden' : ''}`}
            />
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center text-[var(--text-secondary)]"
            >
              <Icon active={isActive || !!item.highlighted} className="h-3.5 w-3.5" />
            </span>
            <span className={`flex-1 truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
            {item.badge ? (
              <span
                className={`rounded-full border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)] ${isCollapsed ? 'lg:hidden' : ''}`}
              >
                {item.badge}
              </span>
            ) : null}
          </>
        )}
      </NavLink>
    </li>
  )
}

type SidebarFooterProps = {
  isCollapsed: boolean
}

function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  return (
    <div className="mt-3 border-t border-[var(--border-subtle)] pt-3">
      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--text-secondary)] transition-colors duration-150 ${isCollapsed ? 'justify-center lg:px-1.5' : ''}`}
        title="Operations status"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full bg-[var(--indicator-muted)] ${isCollapsed ? 'lg:hidden' : ''}`}
        />
        <span
          className={`${
            isCollapsed ? 'flex' : 'hidden'
          } h-5 w-5 items-center justify-center text-[var(--text-secondary)]`}
        >
          <StatusIcon className="h-3.5 w-3.5" />
        </span>
        <span className={`uppercase tracking-[0.35em] ${isCollapsed ? 'lg:hidden' : ''}`}>Status</span>
      </div>
    </div>
  )
}

function StatusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) {
    return path.replace(/\/+$/, '')
  }
  return path
}
