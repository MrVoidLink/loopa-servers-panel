import { useCallback, useEffect, useState } from 'react'

const DESKTOP_QUERY = '(min-width: 1024px)'

export function useSidebarState() {
  const initialDesktop =
    typeof window !== 'undefined'
      ? window.matchMedia(DESKTOP_QUERY).matches
      : true

  const [isDesktop, setIsDesktop] = useState(initialDesktop)
  const [isOpen, setIsOpen] = useState(initialDesktop)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const media = window.matchMedia(DESKTOP_QUERY)
    const handleMatch = (matches: boolean) => {
      setIsDesktop(matches)
      setIsOpen(matches)
      if (!matches) {
        setIsCollapsed(false)
      }
    }

    handleMatch(media.matches)
    const listener = (event: MediaQueryListEvent) => handleMatch(event.matches)

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', listener)
    } else {
      media.addListener(listener)
    }

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [])

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => (isDesktop ? prev : !prev))
  }, [isDesktop])

  const close = useCallback(() => {
    if (!isDesktop) {
      setIsOpen(false)
    }
  }, [isDesktop])

  const toggleCollapse = useCallback(() => {
    if (!isDesktop) return
    setIsCollapsed((prev) => !prev)
  }, [isDesktop])

  const expandSidebar = useCallback(() => {
    if (!isDesktop) {
      setIsOpen(true)
      return
    }
    if (isCollapsed) {
      setIsCollapsed(false)
    }
  }, [isDesktop, isCollapsed])

  return {
    isOpen,
    isCollapsed,
    toggleOpen,
    toggleCollapse,
    close,
    expandSidebar,
  }
}
