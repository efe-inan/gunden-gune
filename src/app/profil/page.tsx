'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const INTEREST_OPTIONS = [
    { value: 'Fiziksel Sağlık', icon: 'fitness_center' },
    { value: 'Zihinsel Sağlık', icon: 'psychology' },
    { value: 'Kariyer/Öğrenim', icon: 'work' },
    { value: 'Sosyal Beceriler', icon: 'groups' },
    { value: 'Finansal Okuryazarlık', icon: 'account_balance' }
]

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        interests: [] as string[],
        goals: '',
        freeTime: ''
    })
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth')
        } else if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                interests: user.interests || [],
                goals: user.goals || '',
                freeTime: user.freeTime || ''
            })
        }
    }, [user, loading, router])

    const handleInterestToggle = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }))
    }

    const handleSave = async () => {
        setSaveStatus('saving')
        // Simulate save - in real app would call updateUser
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaveStatus('saved')
        setIsEditing(false)
        setTimeout(() => setSaveStatus('idle'), 2000)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

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
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-text-main">Profil</h1>
                            <p className="text-text-secondary">Hesap bilgilerini yönet</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-main hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Dashboard'a Dön
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="bg-surface-light rounded-2xl border border-border-color shadow-soft overflow-hidden mb-6">
                        {/* Avatar Section */}
                        <div className="bg-primary/10 p-8 text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-5xl text-primary">person</span>
                            </div>
                            <h2 className="text-xl font-bold text-text-main">{formData.name || 'İsimsiz Kullanıcı'}</h2>
                            <p className="text-text-secondary text-sm">{formData.email}</p>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">İsim</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light disabled:bg-border-color/20 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="İsminizi girin"
                                />
                            </div>

                            {/* Email (readonly) */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">E-posta</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-border-color/20 cursor-not-allowed text-text-secondary"
                                />
                                <p className="text-xs text-text-secondary mt-1">E-posta adresi değiştirilemez</p>
                            </div>

                            {/* Free Time */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">Günlük Boş Zaman</label>
                                <select
                                    value={formData.freeTime}
                                    onChange={(e) => setFormData(prev => ({ ...prev, freeTime: e.target.value }))}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light disabled:bg-border-color/20 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="30 dakika - 1 saat">30 dakika - 1 saat</option>
                                    <option value="1 - 2 saat">1 - 2 saat</option>
                                    <option value="2 - 4 saat">2 - 4 saat</option>
                                    <option value="4 saatten fazla">4 saatten fazla</option>
                                </select>
                            </div>

                            {/* Interests */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-3">İlgi Alanları</label>
                                <div className="flex flex-wrap gap-2">
                                    {INTEREST_OPTIONS.map((option) => {
                                        const isSelected = formData.interests.includes(option.value)
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => isEditing && handleInterestToggle(option.value)}
                                                disabled={!isEditing}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                                    ? 'bg-primary text-white'
                                                    : 'bg-border-color/50 text-text-main hover:bg-border-color'
                                                    } ${!isEditing ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                            >
                                                <span className="material-symbols-outlined text-lg">{option.icon}</span>
                                                {option.value}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Goals */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">Hedefler</label>
                                <textarea
                                    value={formData.goals}
                                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                                    disabled={!isEditing}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-border-color bg-surface-light disabled:bg-border-color/20 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Hedeflerinizi yazın..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-4 border-t border-border-color">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            disabled={saveStatus === 'saving'}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
                                        >
                                            {saveStatus === 'saving' ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                                    Kaydediliyor...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined">save</span>
                                                    Kaydet
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-3 text-text-secondary hover:text-text-main font-medium rounded-xl hover:bg-border-color/50 transition-all"
                                        >
                                            İptal
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                        Düzenle
                                    </button>
                                )}
                            </div>

                            {saveStatus === 'saved' && (
                                <div className="flex items-center gap-2 text-green-500 text-sm">
                                    <span className="material-symbols-outlined">check_circle</span>
                                    Değişiklikler kaydedildi
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-surface-light rounded-2xl border border-red-200 p-6">
                        <h3 className="text-lg font-bold text-red-600 mb-2">Tehlikeli Bölge</h3>
                        <p className="text-text-secondary text-sm mb-4">
                            Hesabınızdan çıkış yapabilir veya hesabınızı silebilirsiniz.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleSignOut}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-border-color text-text-main font-medium rounded-xl hover:bg-border-color/50 transition-all"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                Çıkış Yap
                            </button>
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all"
                            >
                                <span className="material-symbols-outlined">delete</span>
                                Hesabı Sil
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
