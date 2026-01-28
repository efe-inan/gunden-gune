'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />

      <main className="flex-1">
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                Hakkımızda
              </h1>
              <p className="text-lg text-text-secondary">
                21 günde kendini keşfetme yolculuğunda rehberin oluyoruz.
              </p>
            </div>

            <div className="space-y-12">
              <div className="bg-surface-light rounded-2xl p-8 shadow-sm border border-border-color fade-in-up">
                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  Vizyonumuz
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Herkesin potansiyelini gerçekleştirmesine ve daha mutlu, dengeli bir hayat sürdürmesine yardımcı olmak. Bilimsel temelli yöntemler ve destekleyici bir topluluk ile kişisel gelişim yolculuğunda yanınızdayız.
                </p>
              </div>

              <div className="bg-surface-light rounded-2xl p-8 shadow-sm border border-border-color fade-in-up">
                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  Misyonumuz
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  Erişilebilir, bilimsel ve sürdürülebilir kişisel gelişim araçları sunmak. 21 günlük programımız ile küçük adımlarla büyük değişimler yaratmanıza ve kalıcı alışkanlıklar kazanmanıza yardımcı oluyoruz.
                </p>
              </div>

              <div className="bg-surface-light rounded-2xl p-8 shadow-sm border border-border-color fade-in-up">
                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">favorite</span>
                  Değerlerimiz
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <p className="text-text-secondary">Bilimsel temelli yaklaşım</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <p className="text-text-secondary">Kullanıcı odaklı tasarım</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <p className="text-text-secondary">Sürdürülebilir gelişim</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <p className="text-text-secondary">Destekleyici topluluk</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-light rounded-2xl p-8 shadow-sm border border-border-color fade-in-up">
                <h2 className="text-2xl font-bold text-text-main mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  Ekibimiz
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Tutkulu profesyonellerden oluşan ekibimiz, kişisel gelişim alanında yılların deneyimine sahip. Psikologlar, yaşam koçları ve teknoloji uzmanlarından oluşan ekibimizle en iyi deneyimi sunmak için çalışıyoruz.
                </p>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover-lift"
                >
                  Yolculuğa Başla
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
