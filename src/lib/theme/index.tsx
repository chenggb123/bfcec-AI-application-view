'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
})

const COOKIE_NAME = 'theme'
const COOKIE_MAX_AGE = 31536000 // 1 year

export function ThemeProvider({ children, initialTheme = 'dark' }: { children: ReactNode; initialTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)

  // Keep the <html data-theme> attribute and the cookie in sync with state.
  // The initial attribute is set server-side from the cookie (see layout.tsx);
  // this effect ensures subsequent client-side toggles persist and re-render.
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
