'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/design-system/colors';
import { Button } from '@/design-system/components/Button';
import { slideDown } from '@/design-system/animations';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Özellikler', href: '/#features' },
    { name: 'Fiyatlandırma', href: '/#pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  const userNavigation = [
    { name: 'Kontrol Paneli', href: '/dashboard' },
    { name: 'Program', href: '/program' },
    { name: 'İlerleme', href: '/progress' },
    { name: 'Profil', href: '/profile' },
    { name: 'Ayarlar', href: '/profile/settings', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-background-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <div className="relative w-14 h-14">
              <Image
                src="/logo.png"
                alt="Günden Güne Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-semibold text-text-900">Günden Güne</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-600 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/program"
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-1.5 text-sm bg-primary-500 text-white hover:bg-primary-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                >
                  Programa Devam Et
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-background-100 transition-colors">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-background-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {userNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-background-100 transition-colors"
                      >
                        {item.icon && <item.icon className="w-4 h-4 text-text-400" />}
                        <span className="text-text-700">{item.name}</span>
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background-100 transition-colors text-error-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-1.5 text-sm bg-transparent text-text-400 hover:bg-background-200 focus:ring-text-400"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-3 py-1.5 text-sm bg-primary-500 text-white hover:bg-primary-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                >
                  Başla
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={slideDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden bg-white border-t border-background-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 rounded-lg hover:bg-background-100 text-text-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <hr className="border-background-200" />
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-4 py-2 rounded-lg hover:bg-background-100 text-text-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-background-100 text-error-600"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 rounded-lg hover:bg-background-100 text-text-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/auth/register"
                    className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base bg-primary-500 text-white hover:bg-primary-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Başla
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
