'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-light border border-border-color hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 active:scale-95 group"
            title={theme === 'light' ? 'Karanlık temaya geç' : 'Aydınlık temaya geç'}
        >
            {theme === 'light' ? (
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors">
                    dark_mode
                </span>
            ) : (
                <span className="material-symbols-outlined text-primary transition-colors">
                    light_mode
                </span>
            )}
        </button>
    )
}
