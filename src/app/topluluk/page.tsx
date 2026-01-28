'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Story {
    id: string
    author: string
    avatar: string
    date: string
    content: string
    likes: number
    comments: number
    liked: boolean
    category: string
}

const MOCK_STORIES: Story[] = [
    {
        id: '1',
        author: 'Ayşe Y.',
        avatar: 'https://i.pravatar.cc/150?img=1',
        date: '2 saat önce',
        content: '21 günlük programın ilk haftasını tamamladım! Sabah rutini kurmak hayatıma inanılmaz bir düzen getirdi. Her gün 6\'da kalkıp meditasyon yapmaya başladım. 🌅',
        likes: 24,
        comments: 5,
        liked: false,
        category: 'Başarı Hikayesi'
    },
    {
        id: '2',
        author: 'Mehmet K.',
        avatar: 'https://i.pravatar.cc/150?img=3',
        date: '5 saat önce',
        content: 'Bugün 10 gün seri rozetini kazandım! Kendimle gurur duyuyorum. Küçük adımlar gerçekten büyük değişimlere yol açıyor. 🔥',
        likes: 42,
        comments: 8,
        liked: true,
        category: 'Motivasyon'
    },
    {
        id: '3',
        author: 'Elif S.',
        avatar: 'https://i.pravatar.cc/150?img=5',
        date: 'Dün',
        content: 'Finansal okuryazarlık görevleri sayesinde ilk bütçemi oluşturdum. Artık paramın nereye gittiğini biliyorum ve tasarruf etmeye başladım. 💰',
        likes: 18,
        comments: 3,
        liked: false,
        category: 'İpucu'
    },
    {
        id: '4',
        author: 'Can B.',
        avatar: 'https://i.pravatar.cc/150?img=8',
        date: 'Dün',
        content: '5 dakikalık meditasyon ile başladım, şimdi 20 dakikaya çıktım. Zihinsel sağlık görevleri gerçekten işe yarıyor. Daha az stresli ve daha odaklıyım. 🧘',
        likes: 31,
        comments: 6,
        liked: false,
        category: 'Başarı Hikayesi'
    },
    {
        id: '5',
        author: 'Zeynep A.',
        avatar: 'https://i.pravatar.cc/150?img=9',
        date: '2 gün önce',
        content: 'Günden Güne sayesinde hayatımda olumlu değişiklikler yaşıyorum. Arkadaşlarım bile fark etti! Bu topluluğun bir parçası olmaktan mutluyum. ❤️',
        likes: 56,
        comments: 12,
        liked: true,
        category: 'Motivasyon'
    }
]

const STATS = [
    { label: 'Aktif Üye', value: '2,847', icon: 'groups' },
    { label: 'Tamamlanan Görev', value: '45,231', icon: 'task_alt' },
    { label: 'Kazanılan Rozet', value: '8,924', icon: 'emoji_events' },
    { label: 'Toplam Gün', value: '12,456', icon: 'calendar_month' }
]

export default function CommunityPage() {
    const [stories, setStories] = useState<Story[]>(MOCK_STORIES)
    const [filter, setFilter] = useState<string>('Tümü')

    const categories = ['Tümü', 'Başarı Hikayesi', 'Motivasyon', 'İpucu']

    const toggleLike = (id: string) => {
        setStories(prev =>
            prev.map(s =>
                s.id === id
                    ? { ...s, liked: !s.liked, likes: s.liked ? s.likes - 1 : s.likes + 1 }
                    : s
            )
        )
    }

    const filteredStories = filter === 'Tümü'
        ? stories
        : stories.filter(s => s.category === filter)

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-12">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">Topluluk</h1>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Binlerce kişiyle birlikte dönüşüm yolculuğuna çık. Hikayeleri oku, ilham al ve kendi deneyimlerini paylaş.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-in-up">
                        {STATS.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="bg-surface-light rounded-2xl p-6 border border-border-color text-center hover-lift transition-all"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className="material-symbols-outlined text-3xl text-primary mb-2">{stat.icon}</span>
                                <p className="text-2xl md:text-3xl font-black text-text-main">{stat.value}</p>
                                <p className="text-sm text-text-secondary">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8 fade-in-up">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === category
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-surface-light border border-border-color text-text-main hover:border-primary/50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Stories */}
                    <div className="space-y-6">
                        {filteredStories.map((story, index) => (
                            <div
                                key={story.id}
                                className="bg-surface-light rounded-2xl p-6 border border-border-color hover-lift transition-all fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={story.avatar}
                                        alt={story.author}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <span className="font-bold text-text-main">{story.author}</span>
                                                <span className="text-text-secondary text-sm ml-2">• {story.date}</span>
                                            </div>
                                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                                                {story.category}
                                            </span>
                                        </div>
                                        <p className="text-text-main leading-relaxed mb-4">{story.content}</p>
                                        <div className="flex items-center gap-6">
                                            <button
                                                onClick={() => toggleLike(story.id)}
                                                className={`flex items-center gap-2 transition-colors ${story.liked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined">
                                                    {story.liked ? 'favorite' : 'favorite_border'}
                                                </span>
                                                <span className="text-sm font-medium">{story.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">chat_bubble_outline</span>
                                                <span className="text-sm font-medium">{story.comments}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center bg-primary/5 rounded-2xl p-8 border border-primary/20 fade-in-up">
                        <span className="material-symbols-outlined text-5xl text-primary mb-4">edit_note</span>
                        <h3 className="text-2xl font-bold text-text-main mb-2">Hikayeni Paylaş</h3>
                        <p className="text-text-secondary mb-6">
                            Kendi dönüşüm hikayeni toplulukla paylaş ve başkalarına ilham ver.
                        </p>
                        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover-lift">
                            <span className="material-symbols-outlined">add</span>
                            Hikaye Yaz
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
