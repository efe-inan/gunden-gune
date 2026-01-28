'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (!user.workingStatus) {
          router.push('/onboarding')
        } else {
          router.push('/dashboard')
        }
      }
    }
  }, [user, loading, router])

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col items-start gap-6 text-left order-2 lg:order-1 fade-in-up">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                  Yeni program kayıtları başladı
                </div>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-text-main sm:text-5xl lg:text-6xl">
                  Kendini Keşfetme <br className="hidden lg:block" />
                  <span className="relative whitespace-nowrap text-primary">
                    <svg
                      aria-hidden="true"
                      className="absolute left-0 top-2/3 h-[0.58em] w-full fill-primary/20"
                      preserveAspectRatio="none"
                      viewBox="0 0 418 42"
                    >
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C61.16 13.643 45.698 15.694 18.733 20.343c-5.64 1.058-10.966 2.074-11.972 2.278l-5.748 1.494c-2.458.625-2.288 3.522.092 3.864 13.846 1.989 57.072 4.417 111.233 1.963 9.423-.426 31.028-1.442 59.907-3.805 28.665-2.348 88.068-1.391 143.682 7.042 18.397 2.788 47.906 8.356 61.272 1.455 1.547-.798 1.036-3.328-1.583-3.69-37.472-5.186-81.854-3.133-125.666 4.093-36.918 6.088-75.12 11.277-111.411 7.227-23.957-2.673-40.407-7.227-50.607-10.456-17.518-5.545-31.548-6.191-45.746-2.527-2.732.705-5.695-.316-6.108-2.607-.532-2.955 2.723-5.26 5.86-5.467 43.197-2.844 116.22-3.615 159.957 2.246 10.986 1.472 26.68 3.535 27.203 3.655 2.924.664 6.784-.814 6.08-4.226-.757-3.666-5.875-4.497-8.354-4.288z"></path>
                    </svg>
                    <span className="relative">Yolculuğun</span>
                  </span>
                </h1>
                <p className="text-lg font-normal leading-relaxed text-text-secondary max-w-lg">
                  Bilimsel temelli alışkanlık kazanma yöntemleriyle, zihnini ve ruhunu 21 günde dönüştür. Küçük adımlarla büyük değişimler yaratmaya başla.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                  <button
                    onClick={() => router.push('/auth')}
                    className="flex h-12 min-w-[160px] items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-primary-dark"
                  >
                    Yolculuğa Başla
                  </button>
                  <button className="flex h-12 min-w-[160px] items-center justify-center rounded-xl border-2 border-border-color bg-transparent px-6 text-base font-bold text-text-main hover:border-primary hover:text-primary transition-all">
                    Programı İncele
                  </button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    <div
                      className="h-10 w-10 overflow-hidden rounded-full border-2 border-background-light bg-gray-200 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAM_9cZsXkHxknfp_ACkigCQv_mblCKHZp57Wx8bh_dNGFAhEeXUiS860Kj8F81eT8qi0FjmgielfqJuiBRDItoqXNr41zbPw5LpMmPqybS2d2R9UsTmtg7BLgC_Rgwisn6IwL9Lb-rL3PYfGSXdvM7g7T_J0NGt8z6B_RXIpzH9ZxYh_53lKOgpb9Dd-Ur7X5NvkplhCYdQ6iR77fF-lEPsUMAt2PEtKeou_t4VCigbv-HMDRTQ_5sQRS8bStBYK_ERR4EihNXtRjO")'
                      }}
                    ></div>
                    <div
                      className="h-10 w-10 overflow-hidden rounded-full border-2 border-background-light bg-gray-200 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBsBoDB5cGfAF4NNrVAxRmXAz4noRb39QMJTD8nzcHCZIbe8-OlmMECSGRuUKBww-nu61wDERrfWiEKN5Hu4ICeu_QFj_T-9HbFP4cdoxcES-cRKyWC01f6Yd7aI8RrQ3YwZiZJ2DOZbvdpD5x7UjbEnJs2EwEVkg3qJAG8qN_pEFHxLMP0A4DRRBkr7IHb4XZQny2oKirwaOAy6X_O85d4CCKDAlHJu27ro5K_8FuujJDsKWjV0HROpLDYs9xFqYK0K36KA2OaG6Gi")'
                      }}
                    ></div>
                    <div
                      className="h-10 w-10 overflow-hidden rounded-full border-2 border-background-light bg-gray-200 bg-cover bg-center"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD3X7ONnHOILJrKlDb0PtOvWbT_KiHkVFzLhRv4cErdI6zNUOEUlyJTaqXXHobSI0OZbhuoY0hI2zWXjV1qjLACbggaoDO1CvGglF73eIRC-RiL69Ti3LxY1oLNW_kNBidDrqSQQfFTEm2vv1vKXfLtUl6q-k7ncyRGvvVbD6ZnOjH3XedD1nst0mE_XBEe64E3TCUmsIYbCCjkNueXbm7aKOKnlgq1jZQF_SanQ17mEB70eQm7xVP5eJ2qe6BtTSGCtuTbR2cjYcxq")'
                      }}
                    ></div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background-light bg-background-alt text-xs font-bold text-text-secondary">
                      +2k
                    </div>
                  </div>
                  <div className="text-sm font-medium text-text-secondary">
                    <span className="font-bold text-text-main">2.000+</span> Mutlu Katılımcı
                  </div>
                </div>
              </div>
              <div className="relative order-1 lg:order-2 h-full min-h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[2rem] transform rotate-3 scale-95 opacity-60"></div>
                <div
                  className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/10 bg-cover bg-center bg-no-repeat min-h-[400px] lg:min-h-[600px]"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPQqpVX7NpV-X0cM2CZ72DSNXVmrXNd_ovOzYSLd8PsDjUKVSpuY0126Ww6y_3-5ONWubgrVuoLfouLsNP0fAP6AT6e83xRpFDRcpxG5ETnEnhHKvzxz1V_9PN7wkSiB5z9wGE0bRZA2RqgI5jxIPo21lOApwX3N-8Ic8L2Mo_iR-YGddMyOtEsEnvU6ci6BYoCyi0atZW4czsg6JMc41amwoMqKznOwMCw4OrrTzQH4WchB8KiHllrI_SjFOwsdvwVzcMiZrAAVwW")'
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  {/* Floating Card */}
                  <div className="absolute bottom-8 left-8 right-8 backdrop-blur-md bg-white/90 p-5 rounded-2xl border border-white/20 shadow-lg fade-in-up">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <span className="material-symbols-outlined">self_improvement</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">Günlük Meditasyon</p>
                        <p className="text-xs text-text-secondary">Zihinsel denge için 10 dakika</p>
                      </div>
                      <div className="ml-auto">
                        <span className="material-symbols-outlined text-green-500">check_circle</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-16 bg-background-alt">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-black text-text-main sm:text-4xl">Neler Kazanacaksın?</h2>
              <p className="mt-4 text-lg text-text-secondary">Bu program, zihinsel ve ruhsal dengeni bulman için özenle tasarlandı.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border-color bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg hover-lift">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-main">Zihinsel Berraklık</h3>
                <p className="text-text-secondary">Karmaşık düşüncelerden arın, odaklanma yeteneğini artır ve zihnindeki sisi dağıt.</p>
              </div>
              {/* Card 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border-color bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg hover-lift">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">event_note</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-main">Günlük Görevler</h3>
                <p className="text-text-secondary">Her gün seni geliştirecek, uygulanabilir küçük adımlarla büyük hedeflere yürü.</p>
              </div>
              {/* Card 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border-color bg-surface-light p-8 transition-all hover:border-primary/50 hover:shadow-lg hover-lift">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">favorite</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-text-main">İçsel Huzur</h3>
                <p className="text-text-secondary">Kendinle barışık, stres yönetimini öğrenmiş ve dengeli bir ruh haline kavuş.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4 text-center mb-16">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">Yol Haritası</span>
              <h2 className="text-3xl font-black text-text-main sm:text-4xl">21 Günlük Dönüşüm</h2>
            </div>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 md:left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

              {/* Step 1 */}
              <div className="relative mb-12 flex flex-col items-center md:flex-row md:justify-between group">
                <div className="flex items-center md:w-[45%] md:flex-row-reverse mb-4 md:mb-0">
                  <div className="text-center md:text-right pr-4">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">Başlangıç</h3>
                    <p className="text-sm font-medium text-primary">Bugün</p>
                    <p className="mt-2 text-text-secondary">Niyetini belirle, hedeflerini koy ve ilk adımı at.</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-surface-light border-4 border-primary z-10 shadow-lg">
                  <span className="material-symbols-outlined text-primary text-sm font-bold">flag</span>
                </div>
                <div className="md:w-[45%]"></div>
              </div>

              {/* Step 2 */}
              <div className="relative mb-12 flex flex-col items-center md:flex-row md:justify-between group">
                <div className="md:w-[45%]"></div>
                <div className="absolute left-6 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-surface-light border-4 border-border-color group-hover:border-primary z-10 shadow transition-colors">
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors text-sm">visibility</span>
                </div>
                <div className="flex items-center md:w-[45%] pl-12 md:pl-8 pt-2 md:pt-0">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">1. Hafta: Farkındalık</h3>
                    <p className="text-sm font-medium text-primary">1-7. Gün</p>
                    <p className="mt-2 text-text-secondary">Otomatik davranışlarını keşfet ve kendini gözlemle.</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative mb-12 flex flex-col items-center md:flex-row md:justify-between group">
                <div className="flex items-center md:w-[45%] md:flex-row-reverse mb-4 md:mb-0 pl-12 md:pl-0">
                  <div className="text-left md:text-right pr-0 md:pr-8">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">2. Hafta: Alışkanlık</h3>
                    <p className="text-sm font-medium text-primary">8-14. Gün</p>
                    <p className="mt-2 text-text-secondary">Yeni rutinleri hayatına entegre etmeye başla.</p>
                  </div>
                </div>
                <div className="absolute left-6 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-surface-light border-4 border-border-color group-hover:border-primary z-10 shadow transition-colors">
                  <span className="material-symbols-outlined text-text-secondary group-hover:text-primary transition-colors text-sm">repeat</span>
                </div>
                <div className="md:w-[45%]"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col items-center md:flex-row md:justify-between group">
                <div className="md:w-[45%]"></div>
                <div className="absolute left-6 md:left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary border-4 border-primary/30 z-10 shadow-lg shadow-primary/40">
                  <span className="material-symbols-outlined text-white text-sm">emoji_nature</span>
                </div>
                <div className="flex items-center md:w-[45%] pl-12 md:pl-8 pt-2 md:pt-0">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">3. Hafta: Dönüşüm</h3>
                    <p className="text-sm font-medium text-primary">15-21. Gün</p>
                    <p className="mt-2 text-text-secondary">Değişimi kucakla ve yeni seni kutla.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-16 text-center">
              <button
                onClick={() => router.push('/auth')}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:bg-primary-dark"
              >
                Hemen Başla
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
