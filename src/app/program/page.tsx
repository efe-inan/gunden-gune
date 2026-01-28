'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const DAYS = Array.from({ length: 21 }, (_, i) => i + 1)

const DAY_THEMES: Record<string, { icon: string; color: string; bg: string }> = {
  'Fiziksel Sağlık': { icon: 'fitness_center', color: 'text-green-500', bg: 'bg-green-500/10' },
  'Zihinsel Sağlık': { icon: 'psychology', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'Kariyer/Öğrenim': { icon: 'school', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  'Sosyal Beceriler': { icon: 'groups', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  'Finansal Okuryazarlık': { icon: 'account_balance', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
}

const getDayTheme = (day: number) => {
  const themes = Object.keys(DAY_THEMES)
  return themes[(day - 1) % themes.length]
}

export default function ProgramPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />

      <main className="flex-1">
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                21 Günlük Program
              </h1>
              <p className="text-lg text-text-secondary">
                Her gün yeni bir adım, her adımda yeni bir keşif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DAYS.map((day) => {
                const theme = getDayTheme(day)
                const themeConfig = DAY_THEMES[theme as keyof typeof DAY_THEMES]
                return (
                  <Link
                    href={`/program/${day}`}
                    key={day}
                    className="bg-surface-light rounded-2xl shadow-sm border border-border-color p-6 cursor-pointer transition-all duration-300 hover-lift hover:shadow-lg group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${themeConfig.bg} ${themeConfig.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                          <span className="material-symbols-outlined text-3xl icon-bounce">{themeConfig.icon}</span>
                        </div>
                        <span className="text-3xl font-bold text-text-main">
                          {day}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-text-main mb-2 transition-colors duration-300 group-hover:text-primary">
                        {theme}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        Bugünün odak noktası: {theme.toLowerCase()} üzerine çalışma.
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-border-color rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
                        </div>
                        <span className="text-xs font-bold text-text-secondary">0/3</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/auth"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-10 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary-dark hover-lift"
              >
                Programa Başla
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
