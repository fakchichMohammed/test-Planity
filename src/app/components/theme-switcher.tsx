'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

interface ThemeSwitcherProps {
  onThemeChange: (isDark: boolean) => void
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setIsDark(isDarkMode)
    onThemeChange(isDarkMode)
  }, [onThemeChange])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('darkMode', newIsDark.toString())
    onThemeChange(newIsDark)
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${
        isDark 
          ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' 
          : 'bg-purple-800 text-purple-200 hover:bg-purple-700'
      } transition-colors duration-200`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </motion.button>
  )
}

