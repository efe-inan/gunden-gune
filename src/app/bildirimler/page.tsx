'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Notification {
    id: string
    type: 'achievement' | 'reminder' | 'system' | 'social'
    title: string
    message: string
    time: string
    read: boolean
    icon: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'achievement',
        title: 'Yeni Rozet Kazandın!',
        message: 'Tebrikler! "İlk Adım" rozetini kazandın. İlk görevini tamamladın!',
        time: '5 dakika önce',
        read: false,
        icon: 'emoji_events'
    },
    {
        id: '2',
        type: 'reminder',
        title: 'Günlük Görev Hatırlatması',
        message: 'Bugünkü görevlerini henüz tamamlamadın. Hadi başlayalım!',
        time: '1 saat önce',
        read: false,
        icon: 'schedule'
    },
    {
        id: '3',
        type: 'social',
        title: 'Yeni Topluluk Mesajı',
        message: 'Ahmet, motivasyon hikayeni beğendi.',
        time: '3 saat önce',
        read: true,
        icon: 'favorite'
    },
    {
        id: '4',
        type: 'system',
        title: 'Haftalık Özet',
        message: 'Bu hafta 5 görevi tamamladın ve 150 XP kazandın!',
        time: 'Dün',
        read: true,
        icon: 'analytics'
    },
    {
        id: '5',
        type: 'achievement',
        title: '3 Günlük Seri!',
        message: 'Harika gidiyorsun! 3 gün üst üste görevlerini tamamladın.',
        time: '2 gün önce',
        read: true,
        icon: 'local_fire_department'
    }
]

export default function NotificationsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth')
        }
    }, [user, loading, router])

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        )
    }

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.read)

    const unreadCount = notifications.filter(n => !n.read).length

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

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'achievement': return 'text-yellow-500 bg-yellow-500/10'
            case 'reminder': return 'text-blue-500 bg-blue-500/10'
            case 'social': return 'text-pink-500 bg-pink-500/10'
            case 'system': return 'text-purple-500 bg-purple-500/10'
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header showAuthButton={false} />

            <main className="flex-1 py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8 fade-in-up">
                        <div>
                            <h1 className="text-3xl font-black text-text-main mb-2">Bildirimler</h1>
                            <p className="text-text-secondary">
                                {unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : 'Tüm bildirimler okundu'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-primary font-semibold hover:underline"
                            >
                                Tümünü okundu işaretle
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6 fade-in-up">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'all'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-light border border-border-color text-text-main hover:border-primary/50'
                                }`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${filter === 'unread'
                                    ? 'bg-primary text-white'
                                    : 'bg-surface-light border border-border-color text-text-main hover:border-primary/50'
                                }`}
                        >
                            Okunmamış
                            {unreadCount > 0 && (
                                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${filter === 'unread' ? 'bg-white text-primary' : 'bg-primary text-white'
                                    }`}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-4">
                        {filteredNotifications.length === 0 ? (
                            <div className="text-center py-12 fade-in-up">
                                <span className="material-symbols-outlined text-6xl text-text-secondary mb-4">notifications_off</span>
                                <p className="text-text-secondary">Bildirim bulunamadı</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification, index) => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id)}
                                    className={`bg-surface-light rounded-2xl p-5 border transition-all duration-300 cursor-pointer hover-lift fade-in-up ${notification.read
                                            ? 'border-border-color'
                                            : 'border-primary/30 bg-primary/5'
                                        }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(notification.type)}`}>
                                            <span className="material-symbols-outlined">{notification.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className={`font-bold ${notification.read ? 'text-text-main' : 'text-primary'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                                )}
                                            </div>
                                            <p className="text-text-secondary text-sm mb-2">{notification.message}</p>
                                            <span className="text-xs text-text-secondary">{notification.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
