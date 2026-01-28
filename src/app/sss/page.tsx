'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const FAQ_ITEMS = [
    {
        category: 'Genel',
        questions: [
            {
                q: '21 günlük program nedir?',
                a: 'Günden Güne, 21 gün boyunca kişisel gelişiminizi destekleyen yapılandırılmış bir programdır. Her gün farklı bir tema üzerinde (fiziksel sağlık, zihinsel sağlık, kariyer, sosyal beceriler, finansal okuryazarlık) çalışarak kendinizi geliştirirsiniz.'
            },
            {
                q: 'Neden 21 gün?',
                a: '21 gün, yeni alışkanlıkların oluşmaya başlaması için gerekli minimum süre olarak kabul edilir. Bu süre zarfında beyniniz yeni sinir yolları oluşturur ve tekrarlanan davranışları otomatikleştirmeye başlar.'
            },
            {
                q: 'Program ücretli mi?',
                a: 'Temel program tamamen ücretsizdir. Kayıt olarak hemen başlayabilirsiniz. İleride sunulacak premium özellikler için ücretli paketler olabilir.'
            }
        ]
    },
    {
        category: 'Hesap ve Kayıt',
        questions: [
            {
                q: 'Nasıl kayıt olabilirim?',
                a: 'Ana sayfadaki "Başla" butonuna tıklayarak e-posta adresiniz ve şifrenizle kolayca kayıt olabilirsiniz. Google veya Apple hesabınızla da giriş yapabilirsiniz.'
            },
            {
                q: 'Şifremi unuttum, ne yapmalıyım?',
                a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.'
            },
            {
                q: 'Hesabımı nasıl silebilirim?',
                a: 'Profil sayfanızdan "Hesabı Sil" butonuna tıklayarak hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz.'
            }
        ]
    },
    {
        category: 'Program ve İlerleme',
        questions: [
            {
                q: 'Bir günü kaçırırsam ne olur?',
                a: 'Endişelenmeyin! Programı kendi hızınızda takip edebilirsiniz. Kaçırdığınız günlere istediğiniz zaman geri dönebilirsiniz. Önemli olan tutarlılık ve devamlılıktır.'
            },
            {
                q: 'Görevleri tamamlamak ne kadar sürer?',
                a: 'Her günün görevleri ortalama 30-60 dakika arasında tamamlanabilir. Görevler, günlük hayatınıza kolayca entegre edilebilecek şekilde tasarlanmıştır.'
            },
            {
                q: 'İlerleme durumumu nasıl takip edebilirim?',
                a: 'Dashboard sayfanızda günlük, haftalık ve genel ilerlemenizi görebilirsiniz. Tamamlanan görevler, streak (seri) sayısı ve kazanılan rozetler burada listelenir.'
            }
        ]
    },
    {
        category: 'Teknik Destek',
        questions: [
            {
                q: 'Uygulama mobilde çalışıyor mu?',
                a: 'Evet, web sitemiz tamamen responsive tasarıma sahiptir ve tüm mobil cihazlarda sorunsuz çalışır. Mobil uygulama da yakında kullanıma sunulacaktır.'
            },
            {
                q: 'Verilerim güvende mi?',
                a: 'Evet, tüm verileriniz güvenli sunucularda şifreli olarak saklanır. Gizlilik politikamızı inceleyerek detaylı bilgi alabilirsiniz.'
            },
            {
                q: 'Bir sorunla karşılaşırsam ne yapmalıyım?',
                a: 'İletişim sayfamızdan bize ulaşabilirsiniz. Teknik destek ekibimiz en kısa sürede size yardımcı olacaktır.'
            }
        ]
    }
]

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<string[]>([])

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1 py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 fade-in-up">
                        <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                            Sıkça Sorulan Sorular
                        </h1>
                        <p className="text-lg text-text-secondary">
                            Merak ettiğiniz her şeyin cevabı burada
                        </p>
                    </div>

                    <div className="space-y-8">
                        {FAQ_ITEMS.map((category, categoryIndex) => (
                            <div key={category.category} className="fade-in-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                                <h2 className="text-xl font-bold text-text-main mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                                        {categoryIndex + 1}
                                    </span>
                                    {category.category}
                                </h2>

                                <div className="space-y-3">
                                    {category.questions.map((item, questionIndex) => {
                                        const itemId = `${categoryIndex}-${questionIndex}`
                                        const isOpen = openItems.includes(itemId)

                                        return (
                                            <div
                                                key={itemId}
                                                className="bg-surface-light rounded-xl border border-border-color overflow-hidden transition-all duration-300 hover:border-primary/30"
                                            >
                                                <button
                                                    onClick={() => toggleItem(itemId)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <span className="font-semibold text-text-main pr-4">{item.q}</span>
                                                    <span className={`material-symbols-outlined text-primary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                                        expand_more
                                                    </span>
                                                </button>

                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                                    <div className="px-5 pb-5 pt-0">
                                                        <p className="text-text-secondary leading-relaxed">{item.a}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still have questions? */}
                    <div className="mt-16 text-center bg-primary/5 rounded-2xl p-8 border border-primary/20 fade-in-up">
                        <span className="material-symbols-outlined text-5xl text-primary mb-4">help</span>
                        <h3 className="text-2xl font-bold text-text-main mb-2">Hala sorunuz mu var?</h3>
                        <p className="text-text-secondary mb-6">
                            Cevabını bulamadığınız sorularınız için bizimle iletişime geçin.
                        </p>
                        <a
                            href="/iletisim"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all hover-lift"
                        >
                            <span className="material-symbols-outlined">mail</span>
                            İletişime Geç
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
