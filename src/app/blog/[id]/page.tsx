'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BLOG_POSTS: Record<string, {
    title: string
    content: string[]
    date: string
    readTime: string
    image: string
    category: string
    author: string
}> = {
    '1': {
        title: '21 Günlük Alışkanlık Formasyonu: Bilimsel Temel',
        date: 'Ocak 2024',
        readTime: '5 dk',
        image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&auto=format&fit=crop',
        category: 'Bilimsel',
        author: 'Dr. Ayşe Yılmaz',
        content: [
            'Beynimiz, alışkanlık oluşturma konusunda inanılmaz bir potansiyele sahip. Nöroplastisite olarak bilinen bu özellik, beynimizin yeni sinir yolları oluşturabilmesini sağlar.',
            '21 gün kuralı, 1960\'larda plastik cerrah Maxwell Maltz tarafından ortaya atılmıştır. Dr. Maltz, hastalarının yeni görünümlerine alışmalarının yaklaşık 21 gün sürdüğünü gözlemlemiştir.',
            'Günümüzde yapılan araştırmalar, alışkanlık oluşturma süresinin kişiden kişiye değiştiğini gösterse de, 21 gün hala etkili bir başlangıç noktası olarak kabul edilmektedir.',
            'Başarılı alışkanlık formasyonu için bazı temel prensipler vardır: Küçük başlayın, tutarlı olun ve kendinize nazik davranın. Her gün küçük bir adım atmak, uzun vadede büyük değişimlere yol açar.',
            'Araştırmalar, bir davranışın otomatik hale gelmesi için ortalama 66 gün gerektiğini göstermektedir. Ancak 21 gün, bu yolculuğun kritik başlangıç aşamasıdır - bu sürede temel sinir yolları oluşmaya başlar.',
        ]
    },
    '2': {
        title: 'Sabah Rutinlerinin Gücü: Gününü Nasıl Başlatmalısın?',
        date: 'Ocak 2024',
        readTime: '7 dk',
        image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=1200&auto=format&fit=crop',
        category: 'Rutinler',
        author: 'Mehmet Kaya',
        content: [
            'Sabah rutini, gününüzün tonunu belirleyen en önemli faktörlerden biridir. Başarılı insanların çoğu, güçlü ve tutarlı sabah rutinlerine sahiptir.',
            'İdeal bir sabah rutini, vücudunuzu ve zihninizi güne hazırlamalıdır. Bu, erken kalkmak, su içmek, egzersiz yapmak ve bir miktar sessiz zaman geçirmek gibi aktiviteleri içerebilir.',
            'Sabah rutininizi oluştururken, kendinize gerçekçi hedefler koyun. 5 dakikalık bir meditasyon veya 10 dakikalık bir yürüyüş bile büyük fark yaratabilir.',
            'Telefonunuza bakmadan önce en az 30 dakika beklemek, sabahınızın kalitesini önemli ölçüde artırabilir. Bu süre, kendi düşüncelerinizle baş başa kalmanızı sağlar.',
            'Unutmayın, en iyi sabah rutini sizin için işe yarayan rutindir. Başkalarının yaptıklarını körü körüne taklit etmek yerine, kendi ihtiyaçlarınıza uygun bir rutin oluşturun.',
        ]
    },
    '3': {
        title: 'Meditasyon ve Odaklanma: Zihnini Susturma Sanatı',
        date: 'Aralık 2023',
        readTime: '6 dk',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop',
        category: 'Zihinsel Sağlık',
        author: 'Zeynep Demir',
        content: [
            'Meditasyon, binlerce yıllık bir pratik olmasına rağmen, modern bilim onun faydalarını ancak son yıllarda tam olarak anlamaya başlamıştır.',
            'Düzenli meditasyon pratiği, stres hormonlarını azaltır, odaklanmayı artırır ve duygusal düzenlemeyi geliştirir. Günde sadece 10 dakika bile önemli faydalar sağlayabilir.',
            'Başlangıç için en kolay teknik, nefes meditasyonudur. Rahat bir pozisyonda oturun, gözlerinizi kapatın ve nefesinize odaklanın. Düşünceler geldiğinde, onları yargılamadan bırakın ve nazikçe nefesinize geri dönün.',
            'Meditasyonun amacı, zihni tamamen susturmak değil, düşüncelerinizle ilişkinizi değiştirmektir. Zamanla, düşüncelerinizi gözlemleme ve onlara tepki vermeden bırakma becerisi gelişir.',
            'Uygulamalar ve rehberli meditasyonlar, başlangıç için harika araçlardır. Ancak, asıl amaç zamanla kendi başınıza pratik yapabilme becerisini geliştirmektir.',
        ]
    },
    '4': {
        title: 'Finansal Özgürlüğe İlk Adımlar',
        date: 'Aralık 2023',
        readTime: '8 dk',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&auto=format&fit=crop',
        category: 'Finans',
        author: 'Ali Özkan',
        content: [
            'Finansal özgürlük, pasif gelirlerinizin yaşam giderlerinizi karşılayabildiği noktadır. Bu hedefe ulaşmak için bilinçli adımlar atmanız gerekir.',
            'İlk adım, bütçe oluşturmaktır. Gelirinizin ve giderlerinizin farkında olmak, finansal kontrol sağlamanın temelidir. Her ay ne kadar para kazandığınızı ve harcadığınızı bilin.',
            '50/30/20 kuralı, basit ama etkili bir bütçeleme yöntemidir: Gelirinizin %50\'si ihtiyaçlara, %30\'u isteklere ve %20\'si tasarruf ve borç ödemeye gitmelidir.',
            'Acil durum fonu oluşturmak, finansal güvenliğin temel taşıdır. En az 3-6 aylık giderinizi karşılayacak bir fon biriktirun.',
            'Yatırım yapmak, uzun vadede servet oluşturmanın anahtarıdır. Bileşik faizin gücünü küçümsemeyin - erken başlamak, küçük miktarlarla bile büyük sonuçlar getirebilir.',
        ]
    },
    '5': {
        title: 'Sosyal Becerilerini Geliştirme: İletişimin Gücü',
        date: 'Kasım 2023',
        readTime: '5 dk',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop',
        category: 'Sosyal',
        author: 'Elif Şahin',
        content: [
            'İletişim becerileri, profesyonel ve kişisel yaşamda başarının en önemli belirleyicilerinden biridir.',
            'Aktif dinleme, etkili iletişimin temelidir. Karşınızdaki kişiyi gerçekten anlamaya çalışın, sadece cevap vermek için beklemeyin.',
            'Beden diliniz, sözleriniz kadar önemlidir. Göz teması kurun, açık bir duruş sergileyin ve karşınızdaki kişiye dönerek konuşun.',
            'Empati kurmak, ilişkileri derinleştirmenin en güçlü yoludur. Kendinizi karşınızdaki kişinin yerine koyun ve duygularını anlamaya çalışın.',
            'Sosyal beceriler, pratikle gelişir. Yeni insanlarla tanışmak ve farklı sosyal ortamlara girmek için fırsatlar yaratın.',
        ]
    },
    '6': {
        title: 'Stres Yönetimi: Huzurlu Bir Zihin İçin',
        date: 'Kasım 2023',
        readTime: '6 dk',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&auto=format&fit=crop',
        category: 'Zihinsel Sağlık',
        author: 'Can Yıldırım',
        content: [
            'Stres, modern yaşamın kaçınılmaz bir parçasıdır. Ancak stresinizi nasıl yönettiğiniz, sağlığınızı ve mutluluğunuzu doğrudan etkiler.',
            'Fiziksel aktivite, stres hormonlarını azaltmanın en etkili yollarından biridir. Düzenli egzersiz, endorfin salgılanmasını artırır ve genel refahı iyileştirir.',
            'Derin nefes almak, anlık stres anlarında hızlı bir rahatlama sağlar. 4-7-8 tekniğini deneyin: 4 saniye nefes alın, 7 saniye tutun, 8 saniye verin.',
            'Uyku, stres yönetiminin kritik bir bileşenidir. Yetersiz uyku, stres tepkisini artırır ve başa çıkma kapasitesini azaltır.',
            'Hayır demeyi öğrenin. Fazla sorumluluk almak, stresin en yaygın nedenlerinden biridir. Sınırlarınızı belirleyin ve koruyun.',
        ]
    }
}

const RELATED_POSTS = [
    { id: '1', title: '21 Günlük Alışkanlık Formasyonu', category: 'Bilimsel' },
    { id: '2', title: 'Sabah Rutinlerinin Gücü', category: 'Rutinler' },
    { id: '3', title: 'Meditasyon ve Odaklanma', category: 'Zihinsel Sağlık' },
]

export default function BlogPostPage() {
    const params = useParams()
    const postId = params.id as string
    const post = BLOG_POSTS[postId]

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col bg-background-light">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-text-main mb-4">Yazı Bulunamadı</h1>
                        <p className="text-text-secondary mb-8">Aradığınız blog yazısı mevcut değil.</p>
                        <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Blog'a Dön
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div className="relative h-[400px] overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="mx-auto max-w-4xl">
                            <span className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
                                {post.category}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-4">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 text-white/80">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">person</span>
                                    {post.author}
                                </span>
                                <span>•</span>
                                <span>{post.date}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                    {post.readTime} okuma
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <article className="py-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-8">
                                <div className="prose prose-lg max-w-none">
                                    {post.content.map((paragraph, index) => (
                                        <p key={index} className="text-text-main leading-relaxed mb-6">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>

                                {/* Share Section */}
                                <div className="mt-12 pt-8 border-t border-border-color">
                                    <h3 className="text-lg font-bold text-text-main mb-4">Bu yazıyı paylaş</h3>
                                    <div className="flex gap-3">
                                        <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                                            <span className="font-bold text-sm">X</span>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                                            <span className="material-symbols-outlined text-lg">work</span>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                <div className="sticky top-24 space-y-6">
                                    {/* Related Posts */}
                                    <div className="bg-surface-light rounded-2xl p-6 border border-border-color">
                                        <h3 className="text-lg font-bold text-text-main mb-4">İlgili Yazılar</h3>
                                        <div className="space-y-4">
                                            {RELATED_POSTS.filter(p => p.id !== postId).map((relatedPost) => (
                                                <Link
                                                    key={relatedPost.id}
                                                    href={`/blog/${relatedPost.id}`}
                                                    className="block p-3 rounded-xl hover:bg-border-color/50 transition-colors"
                                                >
                                                    <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                                                    <h4 className="text-sm font-semibold text-text-main mt-1">{relatedPost.title}</h4>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                                        <h3 className="text-lg font-bold text-text-main mb-2">21 Günlük Programa Katıl</h3>
                                        <p className="text-sm text-text-secondary mb-4">
                                            Kişisel gelişim yolculuğuna bugün başla.
                                        </p>
                                        <Link
                                            href="/auth"
                                            className="block w-full text-center bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-dark transition-all"
                                        >
                                            Ücretsiz Başla
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </article>

                {/* Back to Blog */}
                <div className="pb-12">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Tüm Yazılara Dön
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
