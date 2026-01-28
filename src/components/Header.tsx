'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

interface HeaderProps {
    showAuthButton?: boolean
}

const NAV_LINKS = [
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/program', label: 'Program' },
    { href: '/blog', label: 'Blog' },
]

export default function Header({ showAuthButton = true }: HeaderProps) {
    const pathname = usePathname()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-color bg-background-alt/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <span className="material-symbols-outlined !text-[24px]">spa</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-text-main transition-colors duration-300 group-hover:text-primary">Günden Güne</h2>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link text-sm font-medium relative py-2 transition-colors ${pathname === link.href
                                ? 'text-primary font-bold'
                                : 'text-text-main hover:text-primary'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {showAuthButton && (
                        <Link
                            href="/auth"
                            className="hidden md:flex px-5 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all duration-300 hover-lift text-sm"
                        >
                            Giriş Yap
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-primary/5 text-text-main transition-colors"
                        aria-label="Menüyü aç"
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {mobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden absolute left-0 right-0 top-full bg-background-alt border-b border-border-color shadow-lg transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <nav className="flex flex-col p-4 space-y-2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${pathname === link.href
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-text-main hover:bg-primary/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {showAuthButton && (
                        <Link
                            href="/auth"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300"
                        >
                            Giriş Yap
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}
