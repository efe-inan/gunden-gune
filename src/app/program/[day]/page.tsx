'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const DAY_THEMES: Record<string, { icon: string; color: string; bg: string }> = {
    'Fiziksel Sağlık': { icon: 'fitness_center', color: 'text-green-500', bg: 'bg-green-500/10' },
    'Zihinsel Sağlık': { icon: 'psychology', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    'Kariyer/Öğrenim': { icon: 'school', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    'Sosyal Beceriler': { icon: 'groups', color: 'text-pink-500', bg: 'bg-pink-500/10' },
    'Finansal Okuryazarlık': { icon: 'account_balance', color: 'text-yellow-500', bg: 'bg-yellow-500/10' }
}

const DAY_CONTENT: Record<string, {
    theme: string
    title: string
    description: string
    tasks: { id: string; title: string; description: string; duration: string }[]
    tip: string
    quote: string
}> = {
    '1': {
        theme: 'Fiziksel Sağlık',
        title: 'Harekete Geç',
        description: 'İlk gününde bedeni harekete geçiriyoruz. Basit egzersizlerle günü enerjik bir şekilde başla.',
        tasks: [
            { id: '1-1', title: '10 dakika sabah yürüyüşü', description: 'Sabah kalktığında taze hava al ve vücudunu uyandır.', duration: '10 dk' },
            { id: '1-2', title: '5 dakika esneme', description: 'Basit esneme hareketleri ile kaslarını gevşet.', duration: '5 dk' },
            { id: '1-3', title: '8 bardak su iç', description: 'Gün boyunca en az 2 litre su tüket.', duration: 'Gün boyu' }
        ],
        tip: 'Küçük başla, tutarlı ol. Her gün yapılan küçük adımlar, büyük değişimlere yol açar.',
        quote: '"Bin millik yolculuk, tek bir adımla başlar." - Lao Tzu'
    },
    '2': {
        theme: 'Zihinsel Sağlık',
        title: 'Zihnini Dinle',
        description: 'Bugün zihinsel sağlığına odaklanıyoruz. Meditasyon ve farkındalık pratikleriyle iç huzurunu bul.',
        tasks: [
            { id: '2-1', title: '5 dakika meditasyon', description: 'Sessiz bir köşede otur ve nefesine odaklan.', duration: '5 dk' },
            { id: '2-2', title: 'Günlük yaz', description: 'Bugün nasıl hissettiğini birkaç cümle ile yaz.', duration: '10 dk' },
            { id: '2-3', title: 'Ekran molası', description: 'Gün içinde 30 dakika ekransız vakit geçir.', duration: '30 dk' }
        ],
        tip: 'Meditasyon yaparken düşüncelerin gelmesi normal. Onları yargılama, sadece gözlemle.',
        quote: '"Zihin bir paraşüt gibidir, yalnızca açıkken işe yarar." - Frank Zappa'
    },
    '3': {
        theme: 'Kariyer/Öğrenim',
        title: 'Öğrenmeye Başla',
        description: 'Yeni bir beceri öğrenmeye başlamanın tam zamanı. Küçük adımlarla büyük hedeflere ulaş.',
        tasks: [
            { id: '3-1', title: '15 dakika okuma', description: 'Bir kitap veya eğitici içerik oku.', duration: '15 dk' },
            { id: '3-2', title: 'Yeni bir şey öğren', description: 'İlgilendiğin bir konuda online video izle.', duration: '20 dk' },
            { id: '3-3', title: 'Hedef belirle', description: 'Bu ay öğrenmek istediğin bir beceri belirle.', duration: '10 dk' }
        ],
        tip: 'Öğrenme bir maraton, sprint değil. Güne 15 dakika bile büyük fark yaratır.',
        quote: '"Eğitim pahalıysa, cahilliği deneyin." - Derek Bok'
    },
    '4': {
        theme: 'Sosyal Beceriler',
        title: 'Bağlantı Kur',
        description: 'İnsan ilişkileri mutluluğun temelidir. Bugün sevdiklerinle bağlantı kur.',
        tasks: [
            { id: '4-1', title: 'Bir arkadaşını ara', description: 'Uzun süredir konuşmadığın birini ara.', duration: '15 dk' },
            { id: '4-2', title: 'Teşekkür mesajı gönder', description: 'Hayatındaki birine teşekkür mesajı yaz.', duration: '5 dk' },
            { id: '4-3', title: 'Aktif dinle', description: 'Bugün birisiyle konuşurken tamamen ona odaklan.', duration: 'Gün boyu' }
        ],
        tip: 'İyi bir dinleyici olmak, en güçlü sosyal becerilerden biridir.',
        quote: '"İnsanlar söylediklerini unutur, ama onlara nasıl hissettirdiğini asla unutmaz." - Maya Angelou'
    },
    '5': {
        theme: 'Finansal Okuryazarlık',
        title: 'Paranı Tanı',
        description: 'Finansal özgürlük, paranızı anlamakla başlar. Bugün bir adım atın.',
        tasks: [
            { id: '5-1', title: 'Harcamalarını listele', description: 'Son bir haftadaki harcamalarını gözden geçir.', duration: '15 dk' },
            { id: '5-2', title: 'Bütçe planla', description: 'Bu ay için basit bir bütçe oluştur.', duration: '20 dk' },
            { id: '5-3', title: 'Bir tasarruf hedefi belirle', description: 'Bu ay ne kadar biriktirmek istediğini belirle.', duration: '10 dk' }
        ],
        tip: 'Zenginlik, ne kadar kazandığınla değil, ne kadar biriktirdiğinle ölçülür.',
        quote: '"Parayı kontrol etmezsen, para seni kontrol eder." - Dave Ramsey'
    }
}

// Generate content for days 6-21 based on rotating themes
const generateDayContent = (day: number): typeof DAY_CONTENT[string] => {
    const themes = Object.keys(DAY_THEMES)
    const themeIndex = (day - 1) % themes.length
    const theme = themes[themeIndex]

    const baseContent: Record<string, Omit<typeof DAY_CONTENT[string], 'theme'>> = {
        'Fiziksel Sağlık': {
            title: 'Güçlenmeye Devam',
            description: 'Fiziksel sağlığını bir adım öteye taşı. Bugün biraz daha zorlan.',
            tasks: [
                { id: `${day}-1`, title: '15 dakika yürüyüş veya koşu', description: 'Dışarıda kardio yap.', duration: '15 dk' },
                { id: `${day}-2`, title: '10 şınav veya plank', description: 'Üst vücut gücünü geliştir.', duration: '5 dk' },
                { id: `${day}-3`, title: 'Sağlıklı bir öğün planla', description: 'Beslenme düzenine dikkat et.', duration: '20 dk' }
            ],
            tip: 'Vücudun sana mesaj veriyor, onu dinle ve sınırlarını nazikçe zorla.',
            quote: '"Vücudun senin tapınağın. Onu temiz ve saf tut." - B.K.S. Iyengar'
        },
        'Zihinsel Sağlık': {
            title: 'İç Huzur',
            description: 'Zihinsel dayanıklılığını güçlendir ve stresle başa çıkma becerilerini geliştir.',
            tasks: [
                { id: `${day}-1`, title: '10 dakika derin nefes', description: 'Diyafram nefesi pratik et.', duration: '10 dk' },
                { id: `${day}-2`, title: 'Şükran listesi yaz', description: 'Minnettar olduğun 5 şeyi yaz.', duration: '10 dk' },
                { id: `${day}-3`, title: 'Doğada zaman geçir', description: 'En az 20 dakika açık havada ol.', duration: '20 dk' }
            ],
            tip: 'Şükran duymak, mutluluğun en kısa yoludur.',
            quote: '"Mutluluk dışarıda aranmaz, içimizde keşfedilir." - Buddha'
        },
        'Kariyer/Öğrenim': {
            title: 'Becerilerini Geliştir',
            description: 'Profesyonel gelişimini sürdür ve yeni perspektifler kazan.',
            tasks: [
                { id: `${day}-1`, title: '20 dakika podcast dinle', description: 'Alanınla ilgili eğitici bir podcast bul.', duration: '20 dk' },
                { id: `${day}-2`, title: 'Bir makale oku', description: 'Sektörünle ilgili güncel bir makale oku.', duration: '15 dk' },
                { id: `${day}-3`, title: 'Öğrendiklerini not al', description: 'Bugün öğrendiğin 3 şeyi yaz.', duration: '10 dk' }
            ],
            tip: 'Her gün %1 gelişim, yılda %365 gelişim demektir.',
            quote: '"Öğrenmenin tek yolu denemektir." - Albert Einstein'
        },
        'Sosyal Beceriler': {
            title: 'İlişkilerini Derinleştir',
            description: 'Anlamlı bağlantılar kur ve empati becerini geliştir.',
            tasks: [
                { id: `${day}-1`, title: 'Yeni biriyle tanış', description: 'Bugün en az bir yeni insanla selam laş.', duration: '5 dk' },
                { id: `${day}-2`, title: 'İltifat et', description: 'Üç kişiye samimi iltifatlarda bulun.', duration: 'Gün boyu' },
                { id: `${day}-3`, title: 'Yardım teklif et', description: 'Birine yardım eli uzat.', duration: '15 dk' }
            ],
            tip: 'Vermek almaktan daha büyük mutluluk getirir.',
            quote: '"Başkalarına uzattığın el, sana geri döner." - Rumi'
        },
        'Finansal Okuryazarlık': {
            title: 'Akıllı Para Yönetimi',
            description: 'Finansal alışkanlıklarını güçlendir ve geleceğini planla.',
            tasks: [
                { id: `${day}-1`, title: 'Gereksiz abonelikleri gözden geçir', description: 'Kullanmadığın abonelikleri iptal et.', duration: '15 dk' },
                { id: `${day}-2`, title: 'Finansal hedef belirle', description: '3 aylık bir tasarruf hedefi koy.', duration: '15 dk' },
                { id: `${day}-3`, title: 'Yatırım araştır', description: 'Basit yatırım araçlarını araştır.', duration: '20 dk' }
            ],
            tip: 'Küçük tasarruflar, büyük özgürlüklere kapı açar.',
            quote: '"Paranın efendisi ol, kölesi değil." - Seneca'
        }
    }

    return {
        theme,
        ...baseContent[theme]
    }
}

export default function ProgramDayPage() {
    const params = useParams()
    const dayNum = parseInt(params.day as string)
    const [completedTasks, setCompletedTasks] = useState<string[]>([])

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 21) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-text-main mb-4">Gün Bulunamadı</h1>
                        <p className="text-text-secondary mb-8">Geçerli bir gün seçin (1-21).</p>
                        <Link href="/program" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Programa Dön
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    const dayContent = DAY_CONTENT[dayNum.toString()] || generateDayContent(dayNum)
    const themeConfig = DAY_THEMES[dayContent.theme]
    const completedCount = completedTasks.length
    const totalTasks = dayContent.tasks.length
    const progress = (completedCount / totalTasks) * 100

    const toggleTask = (taskId: string) => {
        setCompletedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        <Link
                            href="/program"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Programa Dön
                        </Link>
                        <div className="flex items-center gap-2">
                            {dayNum > 1 && (
                                <Link
                                    href={`/program/${dayNum - 1}`}
                                    className="p-2 rounded-lg hover:bg-border-color/50 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </Link>
                            )}
                            <span className="text-sm font-medium text-text-secondary">
                                {dayNum}/21 Gün
                            </span>
                            {dayNum < 21 && (
                                <Link
                                    href={`/program/${dayNum + 1}`}
                                    className="p-2 rounded-lg hover:bg-border-color/50 transition-colors"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Day Header */}
                    <div className="bg-surface-light rounded-2xl p-8 border border-border-color shadow-soft mb-8 fade-in-up">
                        <div className="flex items-start gap-6">
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${themeConfig.bg} ${themeConfig.color}`}>
                                <span className="material-symbols-outlined text-4xl">{themeConfig.icon}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${themeConfig.bg} ${themeConfig.color}`}>
                                        {dayContent.theme}
                                    </span>
                                    <span className="text-sm text-text-secondary">Gün {dayNum}</span>
                                </div>
                                <h1 className="text-3xl font-black text-text-main mb-2">
                                    {dayContent.title}
                                </h1>
                                <p className="text-text-secondary">
                                    {dayContent.description}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6 pt-6 border-t border-border-color">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-text-main">İlerleme</span>
                                <span className="text-sm font-bold text-primary">{completedCount}/{totalTasks} görev</span>
                            </div>
                            <div className="h-2 bg-border-color rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-4 mb-8">
                        <h2 className="text-xl font-bold text-text-main mb-4">Bugünün Görevleri</h2>
                        {dayContent.tasks.map((task, index) => {
                            const isCompleted = completedTasks.includes(task.id)
                            return (
                                <div
                                    key={task.id}
                                    onClick={() => toggleTask(task.id)}
                                    className={`bg-surface-light rounded-xl p-5 border transition-all duration-300 cursor-pointer hover-lift ${isCompleted
                                        ? 'border-green-500/50 bg-green-50'
                                        : 'border-border-color hover:border-primary/50'
                                        }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'border-2 border-border-color'
                                            }`}>
                                            {isCompleted && (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-bold ${isCompleted ? 'text-green-600 line-through' : 'text-text-main'}`}>
                                                    {task.title}
                                                </h3>
                                                <span className="text-xs font-medium text-text-secondary bg-border-color/50 px-2 py-1 rounded-full">
                                                    {task.duration}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isCompleted ? 'text-green-600/70' : 'text-text-secondary'}`}>
                                                {task.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Tip & Quote */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                                <h3 className="font-bold text-text-main">Günün İpucu</h3>
                            </div>
                            <p className="text-text-secondary text-sm">{dayContent.tip}</p>
                        </div>
                        <div className="bg-surface-light rounded-2xl p-6 border border-border-color">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-primary">format_quote</span>
                                <h3 className="font-bold text-text-main">Motivasyon</h3>
                            </div>
                            <p className="text-text-secondary text-sm italic">{dayContent.quote}</p>
                        </div>
                    </div>

                    {/* Complete Day Button */}
                    {completedCount === totalTasks && (
                        <div className="text-center py-8 fade-in-up">
                            <div className="inline-flex items-center gap-2 text-green-500 mb-4">
                                <span className="material-symbols-outlined text-4xl">celebration</span>
                                <span className="text-2xl font-bold">Tebrikler!</span>
                            </div>
                            <p className="text-text-secondary mb-6">Bugünün tüm görevlerini tamamladın!</p>
                            {dayNum < 21 && (
                                <Link
                                    href={`/program/${dayNum + 1}`}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover-lift"
                                >
                                    Sonraki Güne Geç
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
