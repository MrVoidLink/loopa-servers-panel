import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const STORAGE_KEY = 'loopa:theme'
const prefersDarkQuery = '(prefers-color-scheme: dark)'
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const isBrowser = typeof window !== 'undefined'

function applyThemeToDocument(theme: ThemeMode) {
  if (!isBrowser) return

  const root = document.documentElement
  root.dataset.theme = theme

  if (theme === 'dark') {
    root.classList.add('theme-dark')
    root.classList.remove('theme-light')
  } else {
    root.classList.add('theme-light')
    root.classList.remove('theme-dark')
  }
}

function resolvePreferredTheme(): ThemeMode {
  if (!isBrowser) {
    return 'dark'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    applyThemeToDocument(stored)
    return stored
  }

  const preferred = window.matchMedia(prefersDarkQuery).matches ? 'dark' : 'light'
  applyThemeToDocument(preferred)
  return preferred
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setModeState] = useState<ThemeMode>(() => resolvePreferredTheme())

  useEffect(() => {
    applyThemeToDocument(mode)
    if (!isBrowser) return
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  useEffect(() => {
    if (!isBrowser) return

    const media = window.matchMedia(prefersDarkQuery)
    const handleChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') {
        return
      }
      setModeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode)
  }, [])

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
