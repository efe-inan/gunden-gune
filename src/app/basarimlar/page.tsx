'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    category: string
    unlocked: boolean
    unlockedAt?: string
    progress?: number
    target?: number
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'İlk Adım',
        description: 'İlk görevini tamamla',
        icon: 'footprint',
        category: 'Başlangıç',
        unlocked: true,
        unlockedAt: '15 Ocak 2024',
        rarity: 'common'
    },
    {
        id: '2',
        title: 'Erken Kuş',
        description: 'Sabah 7\'den önce bir görev tamamla',
        icon: 'wb_twilight',
        category: 'Zaman',
        unlocked: true,
        unlockedAt: '16 Ocak 2024',
        rarity: 'rare'
    },
    {
        id: '3',
        title: '3 Günlük Seri',
        description: '3 gün üst üste görev tamamla',
        icon: 'local_fire_department',
        category: 'Seri',
        unlocked: true,
        unlockedAt: '17 Ocak 2024',
        rarity: 'common'
    },
    {
        id: '4',
        title: 'Haftalık Kahraman',
        description: '7 gün üst üste görev tamamla',
        icon: 'whatshot',
        category: 'Seri',
        unlocked: false,
        progress: 3,
        target: 7,
        rarity: 'rare'
    },
    {
        id: '5',
        title: 'Meditasyon Ustası',
        description: '10 meditasyon görevi tamamla',
        icon: 'self_improvement',
        category: 'Zihinsel Sağlık',
        unlocked: false,
        progress: 2,
        target: 10,
        rarity: 'epic'
    },
    {
        id: '6',
        title: 'Fitness Tutkunu',
        description: '15 fiziksel aktivite görevi tamamla',
        icon: 'fitness_center',
        category: 'Fiziksel Sağlık',
        unlocked: false,
        progress: 5,
        target: 15,
        rarity: 'epic'
    },
    {
        id: '7',
        title: '21 Gün Tamamlandı',
        description: 'Tüm programı bitir',
        icon: 'emoji_events',
        category: 'Başarı',
        unlocked: false,
        progress: 8,
        target: 21,
        rarity: 'legendary'
    },
    {
        id: '8',
        title: 'Sosyal Kelebek',
        description: 'Toplulukta 5 kez etkileşimde bulun',
        icon: 'groups',
        category: 'Sosyal',
        unlocked: false,
        progress: 1,
        target: 5,
        rarity: 'rare'
    }
]

export default function AchievementsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

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

    const filteredAchievements = ACHIEVEMENTS.filter(a => {
        if (filter === 'unlocked') return a.unlocked
        if (filter === 'locked') return !a.unlocked
        return true
    })

    const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length
    const totalCount = ACHIEVEMENTS.length

    const getRarityColor = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common': return 'from-gray-400 to-gray-500'
            case 'rare': return 'from-blue-400 to-blue-600'
            case 'epic': return 'from-purple-400 to-purple-600'
            case 'legendary': return 'from-yellow-400 to-orange-500'
        }
    }

    const getRarityBg = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common': return 'bg-gray-500/10 text-gray-500'
            case 'rare': return 'bg-blue-500/10 text-blue-500'
            case 'epic': return 'bg-purple-500/10 text-purple-500'
            case 'legendary': return 'bg-yellow-500/10 text-yellow-500'
        }
    }

    const getRarityLabel = (rarity: Achievement['rarity']) => {
        switch (rarity) {
            case 'common': return 'Yaygın'
            case 'rare': return 'Nadir'
            case 'epic': return 'Epik'
            case 'legendary': return 'Efsanevi'
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header showAuthButton={false} />

            <main className="flex-1 py-8">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl font-black text-text-main mb-4">Başarımlar & Rozetler</h1>
                        <p className="text-text-secondary text-lg mb-6">
                            Yolculuğunda kazandığın rozetleri keşfet
                        </p>
                        <div className="inline-flex items-center gap-2 bg-surface-light px-6 py-3 rounded-full border border-border-color">
                            <span className="material-symbols-outlined text-primary">emoji_events</span>
                            <span className="font-bold text-text-main">{unlockedCount}</span>
                            <span className="text-text-secondary">/ {totalCount} Rozet Kazanıldı</span>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex justify-center gap-2 mb-8 fade-in-up">
                        {(['all', 'unlocked', 'locked'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-surface-light border border-border-color text-text-main hover:border-primary/50'
                                    }`}
                            >
                                {f === 'all' ? 'Tümü' : f === 'unlocked' ? 'Kazanılan' : 'Kilitli'}
                            </button>
                        ))}
                    </div>

                    {/* Achievements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAchievements.map((achievement, index) => (
                            <div
                                key={achievement.id}
                                className={`relative bg-surface-light rounded-2xl p-6 border transition-all duration-300 hover-lift fade-in-up ${achievement.unlocked
                                        ? 'border-border-color'
                                        : 'border-border-color opacity-75'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Rarity Badge */}
                                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold ${getRarityBg(achievement.rarity)}`}>
                                    {getRarityLabel(achievement.rarity)}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${achievement.unlocked
                                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shadow-lg`
                                        : 'bg-border-color/50 text-text-secondary'
                                    }`}>
                                    <span className="material-symbols-outlined text-3xl">
                                        {achievement.unlocked ? achievement.icon : 'lock'}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className={`font-bold text-lg mb-1 ${achievement.unlocked ? 'text-text-main' : 'text-text-secondary'}`}>
                                    {achievement.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-3">{achievement.description}</p>
                                <span className="text-xs font-medium text-primary">{achievement.category}</span>

                                {/* Progress or Date */}
                                {achievement.unlocked ? (
                                    <div className="mt-4 pt-4 border-t border-border-color flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                                        <span className="text-sm text-text-secondary">{achievement.unlockedAt}</span>
                                    </div>
                                ) : achievement.progress !== undefined && achievement.target !== undefined && (
                                    <div className="mt-4 pt-4 border-t border-border-color">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-text-secondary">İlerleme</span>
                                            <span className="font-bold text-text-main">{achievement.progress}/{achievement.target}</span>
                                        </div>
                                        <div className="h-2 bg-border-color rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-500`}
                                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
