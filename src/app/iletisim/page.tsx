'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))
        setStatus('sent')
        setFormData({ name: '', email: '', subject: '', message: '' })

        setTimeout(() => setStatus('idle'), 5000)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                            İletişim
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8 fade-in-up">
                            <div className="bg-surface-light rounded-2xl p-8 border border-border-color shadow-sm">
                                <h2 className="text-2xl font-bold text-text-main mb-6">Bize Ulaşın</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">mail</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-main">E-posta</h3>
                                            <p className="text-text-secondary">destek@21gun.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">schedule</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-main">Çalışma Saatleri</h3>
                                            <p className="text-text-secondary">Pazartesi - Cuma: 09:00 - 18:00</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-text-main">Adres</h3>
                                            <p className="text-text-secondary">İstanbul, Türkiye</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-surface-light rounded-2xl p-8 border border-border-color shadow-sm">
                                <h2 className="text-xl font-bold text-text-main mb-4">Sosyal Medya</h2>
                                <p className="text-text-secondary text-sm mb-6">
                                    Bizi sosyal medyada takip edin ve güncel kalın.
                                </p>
                                <div className="flex gap-3">
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all hover-lift">
                                        <span className="font-bold">X</span>
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-all hover-lift">
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all hover-lift">
                                        <span className="material-symbols-outlined">work</span>
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all hover-lift">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-surface-light rounded-2xl p-8 border border-border-color shadow-sm fade-in-up">
                            <h2 className="text-2xl font-bold text-text-main mb-6">Mesaj Gönderin</h2>

                            {status === 'sent' ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main mb-2">Mesajınız Gönderildi!</h3>
                                    <p className="text-text-secondary">En kısa sürede size dönüş yapacağız.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main mb-2">İsim</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Adınız Soyadınız"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main mb-2">E-posta</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main mb-2">Konu</label>
                                        <select
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Konu seçin</option>
                                            <option value="genel">Genel Soru</option>
                                            <option value="destek">Teknik Destek</option>
                                            <option value="oneri">Öneri</option>
                                            <option value="sikayet">Şikayet</option>
                                            <option value="isbirligi">İş Birliği</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main mb-2">Mesaj</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                            placeholder="Mesajınızı yazın..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover-lift disabled:opacity-50 cursor-pointer"
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                                Gönderiliyor...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">send</span>
                                                Gönder
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
