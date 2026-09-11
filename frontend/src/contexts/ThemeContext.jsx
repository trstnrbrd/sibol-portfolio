import { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ dark: true }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}