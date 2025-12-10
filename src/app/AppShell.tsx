import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'

import { Sidebar } from './layout/sidebar/Sidebar'
import { useSidebarState } from './layout/sidebar/useSidebarState'
import { Topbar } from './layout/Topbar'

export function AppShell({ children }: PropsWithChildren) {
  const {
    isOpen,
    isCollapsed,
    toggleOpen,
    toggleCollapse,
    close,
    expandSidebar,
  } = useSidebarState()

  return (
    <div className="flex min-h-screen bg-[var(--surface-root)] text-[var(--text-primary)] transition-colors duration-300 lg:h-screen lg:overflow-hidden">
      <Sidebar
        isOpen={isOpen}
        onClose={close}
        isCollapsed={isCollapsed}
        onExpandRequest={expandSidebar}
      />
      <div className="flex flex-1 flex-col bg-[var(--surface-root)] transition-colors duration-300 lg:h-full">
        <Topbar
          isSidebarOpen={isOpen}
          onToggleSidebar={toggleOpen}
          isSidebarCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-5 lg:px-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}
