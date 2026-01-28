'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <header className="w-full px-6 py-4 lg:px-12 flex justify-between items-center absolute top-0 left-0 z-20 bg-background-light/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/')}>
          <div className="w-8 h-8 text-primary bg-primary/10 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-symbols-outlined !text-[24px]">spa</span>
          </div>
          <h1 className="text-text-main text-xl font-bold tracking-tight hidden sm:block group-hover:text-primary transition-colors">Günden Güne</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-semibold text-text-main hover:text-primary transition-colors flex items-center gap-1 hover:scale-105"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Ana Sayfaya Dön
          </button>
        </div>
      </header>

      <main className="flex-1 flex w-full min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-24 lg:px-20 relative bg-background-light z-10">
          <div className="w-full max-w-[480px] flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-text-main tracking-tight leading-tight">Kendini Keşfet</h2>
              <p className="text-text-secondary text-lg">21 günlük kişisel gelişim yolculuğuna başla.</p>
            </div>

            <div className="p-1 bg-background-alt/50 rounded-lg flex relative">
              <button
                onClick={() => setIsLogin(true)}
                className="flex-1 cursor-pointer text-center relative z-10"
              >
                <div className="py-2.5 text-sm font-bold text-text-main transition-colors duration-200">
                  Giriş Yap
                </div>
                <div className={`absolute inset-0 bg-surface-light rounded shadow-sm transition-all duration-300 ${isLogin ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="flex-1 cursor-pointer text-center relative z-10"
              >
                <div className="py-2.5 text-sm font-bold text-text-main transition-colors duration-200">
                  Kayıt Ol
                </div>
                <div className={`absolute inset-0 bg-surface-light rounded shadow-sm transition-all duration-300 ${!isLogin ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-text-main">E-posta Adresi</span>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-light border border-border-color rounded-lg px-4 py-3.5 text-text-main placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="ornek@email.com"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">mail</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-text-main">Şifre</span>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-light border border-border-color rounded-lg px-4 py-3.5 text-text-main placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="******"
                    minLength={6}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">visibility</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/30 hover-lift relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLogin ? 'Yolculuğa Devam Et' : 'Yolculuğa Başla'}
                  <span className="material-symbols-outlined !text-[20px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-color"></div>
              <span className="flex-shrink-0 mx-4 text-text-secondary text-sm">veya şununla devam et</span>
              <div className="flex-grow border-t border-border-color"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-light border border-border-color rounded-lg hover:border-primary/50 hover:bg-background-alt btn-transition hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-text-main font-medium text-sm relative z-10 group-hover:text-primary transition-colors duration-300">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-light border border-border-color rounded-lg hover:border-primary/50 hover:bg-background-alt btn-transition hover-lift group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-5 h-5 text-text-main relative z-10 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.64 3.4 1.63-3.12 1.88-2.68 5.86.29 7.1-1.27 2.4-2.16 3.91-2.34 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-text-main font-medium text-sm relative z-10 group-hover:text-primary transition-colors duration-300">Apple</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/forest-sunrise.png"
              alt="Huzurlu orman manzarası"
              className="w-full h-full object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          <div className="relative z-10 w-full h-full flex flex-col justify-end p-20 text-white">
            <div className="max-w-lg space-y-6">
              <h3 className="text-5xl font-bold leading-tight drop-shadow-lg">
                Değişim şimdi başlıyor.
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default">
                  <span className="material-symbols-outlined text-primary mt-1 icon-bounce">check_circle</span>
                  <div>
                    <h4 className="font-bold text-lg">Günlük Rehberlik</h4>
                    <p className="text-white/80 text-sm">Her gün yeni bir adım ve özel içerik.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default">
                  <span className="material-symbols-outlined text-primary mt-1 icon-bounce">communities</span>
                  <div>
                    <h4 className="font-bold text-lg">Destekleyici Topluluk</h4>
                    <p className="text-white/80 text-sm">Seninle aynı yolda yürüyen binlerce kişi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
