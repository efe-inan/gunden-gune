'use client'

import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const BLOG_POSTS = [
  {
    id: 1,
    title: '21 Günlük Alışkanlık Formasyonu: Bilimsel Temel',
    excerpt: 'Neden 21 gün? Nöroplastisite ve alışkanlık formasyonu hakkında bilmen gereken her şey.',
    date: 'Ocak 2024',
    readTime: '5 dk',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop',
    category: 'Bilimsel'
  },
  {
    id: 2,
    title: 'Sabah Rutinlerinin Gücü: Gününü Nasıl Başlatmalısın?',
    excerpt: 'Verimli ve motive bir gün için sabah rutini oluşturmanın yolları.',
    date: 'Ocak 2024',
    readTime: '7 dk',
    image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?w=800&auto=format&fit=crop',
    category: 'Rutinler'
  },
  {
    id: 3,
    title: 'Meditasyon ve Odaklanma: Zihnini Susturma Sanatı',
    excerpt: 'Düşüncelerini sakinleştirme ve odaklanma becerini geliştirme teknikleri.',
    date: 'Aralık 2023',
    readTime: '6 dk',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop',
    category: 'Zihinsel Sağlık'
  },
  {
    id: 4,
    title: 'Finansal Özgürlüğe İlk Adımlar',
    excerpt: 'Finansal okuryazarlığını geliştirme ve gelecek için yatırım yapma.',
    date: 'Aralık 2023',
    readTime: '8 dk',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop',
    category: 'Finans'
  },
  {
    id: 5,
    title: 'Sosyal Becerilerini Geliştirme: İletişimin Gücü',
    excerpt: 'Daha iyi ilişkiler kurmak için iletişim becerilerini geliştirme.',
    date: 'Kasım 2023',
    readTime: '5 dk',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
    category: 'Sosyal'
  },
  {
    id: 6,
    title: 'Stres Yönetimi: Huzurlu Bir Zihin İçin',
    excerpt: 'Günlük hayatında stresi yönetmek için pratik teknikler.',
    date: 'Kasım 2023',
    readTime: '6 dk',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop',
    category: 'Zihinsel Sağlık'
  }
]

const CATEGORIES = ['Tümü', 'Bilimsel', 'Rutinler', 'Zihinsel Sağlık', 'Finans', 'Sosyal']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />

      <main className="flex-1">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 fade-in-up">
              <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                Blog
              </h1>
              <p className="text-lg text-text-secondary">
                Kişisel gelişim yolculuğunda rehberlik eden makaleler
              </p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between fade-in-up">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-lift
                      ${selectedCategory === category
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-surface-light border border-border-color text-text-main hover:border-primary/50'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ara..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-border-color bg-surface-light focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  search
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <Link
                  href={`/blog/${post.id}`}
                  key={post.id}
                  className="bg-surface-light rounded-2xl shadow-sm border border-border-color overflow-hidden transition-all duration-300 hover-lift hover:shadow-lg group cursor-pointer fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h3>

                    <p className="text-sm text-text-secondary mb-4 overflow-hidden line-clamp-2">
                      {post.excerpt}
                    </p>

                    <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                      Devamını Oku
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <span className="material-symbols-outlined text-6xl text-text-secondary mb-4">search_off</span>
                <p className="text-text-secondary text-lg">
                  Sonuç bulunamadı
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
