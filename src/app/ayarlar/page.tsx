'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SettingsPage() {
    const { user, loading } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const router = useRouter()

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        reminders: true,
        weekly: false
    })

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth')
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-text-secondary">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header showAuthButton={false} />

            <main className="flex-1 py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 fade-in-up">
                        <h1 className="text-3xl font-black text-text-main mb-2">Ayarlar</h1>
                        <p className="text-text-secondary">Uygulama tercihlerinizi yönetin</p>
                    </div>

                    {/* Appearance Settings */}
                    <div className="bg-surface-light rounded-2xl border border-border-color shadow-soft overflow-hidden mb-6 fade-in-up">
                        <div className="p-6 border-b border-border-color">
                            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">palette</span>
                                Görünüm
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text-main">Tema</h3>
                                    <p className="text-sm text-text-secondary">Aydınlık veya karanlık tema seçin</p>
                                </div>
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-color hover:border-primary/50 transition-all"
                                >
                                    <span className="material-symbols-outlined text-primary">
                                        {theme === 'light' ? 'dark_mode' : 'light_mode'}
                                    </span>
                                    <span className="text-text-main font-medium">
                                        {theme === 'light' ? 'Karanlık Tema' : 'Aydınlık Tema'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-surface-light rounded-2xl border border-border-color shadow-soft overflow-hidden mb-6 fade-in-up">
                        <div className="p-6 border-b border-border-color">
                            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">notifications</span>
                                Bildirimler
                            </h2>
                        </div>
                        <div className="divide-y divide-border-color">
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text-main">E-posta Bildirimleri</h3>
                                    <p className="text-sm text-text-secondary">Önemli güncellemeler için e-posta al</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${notifications.email ? 'bg-primary' : 'bg-border-color'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text-main">Push Bildirimleri</h3>
                                    <p className="text-sm text-text-secondary">Tarayıcı üzerinden anlık bildirimler</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${notifications.push ? 'bg-primary' : 'bg-border-color'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.push ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text-main">Günlük Hatırlatıcılar</h3>
                                    <p className="text-sm text-text-secondary">Görevlerini tamamlamak için hatırlatmalar</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, reminders: !prev.reminders }))}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${notifications.reminders ? 'bg-primary' : 'bg-border-color'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.reminders ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-text-main">Haftalık Özet</h3>
                                    <p className="text-sm text-text-secondary">Haftalık ilerleme raporunu e-posta ile al</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, weekly: !prev.weekly }))}
                                    className={`w-12 h-6 rounded-full transition-all duration-300 ${notifications.weekly ? 'bg-primary' : 'bg-border-color'}`}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${notifications.weekly ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-surface-light rounded-2xl border border-border-color shadow-soft overflow-hidden mb-6 fade-in-up">
                        <div className="p-6 border-b border-border-color">
                            <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">person</span>
                                Hesap
                            </h2>
                        </div>
                        <div className="divide-y divide-border-color">
                            <a href="/profil" className="p-6 flex items-center justify-between hover:bg-border-color/20 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-text-main">Profil Bilgileri</h3>
                                    <p className="text-sm text-text-secondary">İsim, e-posta ve diğer bilgilerinizi düzenleyin</p>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                            </a>
                            <a href="/gizlilik" className="p-6 flex items-center justify-between hover:bg-border-color/20 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-text-main">Gizlilik Politikası</h3>
                                    <p className="text-sm text-text-secondary">Verilerinizin nasıl kullanıldığını öğrenin</p>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                            </a>
                            <a href="/kullanim-sartlari" className="p-6 flex items-center justify-between hover:bg-border-color/20 transition-colors">
                                <div>
                                    <h3 className="font-semibold text-text-main">Kullanım Şartları</h3>
                                    <p className="text-sm text-text-secondary">Platform kullanım koşullarını inceleyin</p>
                                </div>
                                <span className="material-symbols-outlined text-text-secondary">chevron_right</span>
                            </a>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end fade-in-up">
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover-lift">
                            <span className="material-symbols-outlined">save</span>
                            Değişiklikleri Kaydet
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
