'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Star, Play, Calendar, Users, Award, ChevronRight, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/design-system/components/Button';
import { fadeInUp, staggerContainer } from '@/design-system/animations';

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: '21 Günlük Yapılandırılmış Program',
      description: 'Kalıcı alışkanlıklar oluşturmak için özenle hazırlanmış günlük programı takip edin',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Kişiselleştirilmiş Görevler',
      description: 'İlgi alanlarınıza ve zaman tercihlerinize göre uyarlanmış aktiviteler',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'İlerlemeni Takip Et',
      description: 'Detaylı analizler ve başarı rozetleri ile gelişimini izle',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Topluluk Desteği',
      description: 'Aynı yolculuktaki benzer düşünen insanlarla bağlantı kur',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Başarımlar Kazan',
      description: 'Dönüm noktalarını ve zorlukları tamamladıkça rozetlerin kilidini aç',
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Başlaması Kolay',
      description: 'Basit başlangıç süreci ile sadece 5 dakikada başla',
    },
  ];

  const testimonials = [
    {
      name: 'Selin Yılmaz',
      role: 'Pazarlama Müdürü',
      content: 'Bu 21 günlük program sabah rutinimi tamamen değiştirdi. Kendimi hiç olmadığı kadar enerjik ve odaklanmış hissediyorum.',
      avatar: 'SY',
    },
    {
      name: 'Murat Demir',
      role: 'Yazılım Mühendisi',
      content: 'Kişiselleştirilmiş yaklaşım tüm farkı yarattı. Programı yoğun programıma göre ayarlayabildim.',
      avatar: 'MD',
    },
    {
      name: 'Elif Kaya',
      role: 'Öğretmen',
      content: 'İlerleme takibi beni her gün motive etti. Serimin arttığını görmek inanılmaz ödüllendiriciydi!',
      avatar: 'EK',
    },
  ];

  const pricing = [
    {
      name: 'Ücretsiz',
      price: '0₺',
      features: [
        'Tam 21 günlük program',
        'Temel ilerleme takibi',
        'Topluluk erişimi',
        'Haftalık içgörüler',
      ],
    },
    {
      name: 'Premium',
      price: '199₺',
      features: [
        'Ücretsizdeki her şey',
        'Gelişmiş analizler',
        'Kişiselleştirilmiş koçluk',
        'Öncelikli destek',
        'Özel içerik',
        'Birebir görüşme',
      ],
      popular: true,
    },
    {
      name: 'Takım',
      price: '499₺',
      features: [
        'Premiumdaki her şey',
        'Takım paneli',
        'Grup meydan okumaları',
        'Yönetici kontrolleri',
        'Özel programlar',
        'Öncelikli kurulum',
      ],
    },
  ];

  const faqs = [
    {
      question: 'Günlük ne kadar zamana ihtiyacım var?',
      answer: 'Günde 15, 30, 45 veya 60 dakika arasında seçim yapabilirsiniz. Program programınıza uyum sağlar.',
    },
    {
      question: 'Programı yeniden başlatabilir miyim?',
      answer: 'Evet! İlerlemenizi sıfırlayabilir ve istediğiniz zaman baştan başlayabilirsiniz.',
    },
    {
      question: 'Bir günü kaçırırsam ne olur?',
      answer: 'Bir günü kaçırmak ilerlemenizi bozmaz. Kaldığınız yerden devam edebilirsiniz.',
    },
    {
      question: 'Mobil uygulama var mı?',
      answer: 'Evet! Mobil uygulamamız hem iOS hem de Android cihazlar için mevcuttur.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              Hayatınızı Günden Güne Dönüştürün
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-bold text-text-900 mb-6"
          >
            Günden Güne İle Daha İyi Alışkanlıklar Edinin,
            <br />
            <span className="text-primary-600">Hedeflerinize Ulaşın</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-text-600 mb-8 max-w-2xl mx-auto"
          >
            Bilimsel temelli 21 günlük kişisel gelişim programımızla hayatlarını dönüştüren binlerce kişiye katılın.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-3 text-lg bg-primary-500 text-white hover:bg-primary-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
            >
              Yolculuğuna Başla <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-6 py-3 text-lg bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50"
            >
              Giriş Yap
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-900 mb-4">Neden 21 Gün Dönüşüm?</h2>
            <p className="text-lg text-text-600">Kalıcı alışkanlıklar oluşturmak için ihtiyacınız olan her şey</p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="p-6 rounded-xl border border-background-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-900 mb-2">{feature.title}</h3>
                <p className="text-text-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-900 mb-4">Nasıl Çalışır?</h2>
            <p className="text-lg text-text-600">Dönüşümünüze 5 basit adımda başlayın</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Hesap Oluştur', desc: 'Saniyeler içinde kayıt ol' },
              { step: '2', title: 'Tanışma', desc: 'Bize kendinden bahset' },
              { step: '3', title: 'Zaman Seç', desc: 'Günde 15-60 dk' },
              { step: '4', title: 'Günlük Görevler', desc: 'Aktiviteleri tamamla' },
              { step: '5', title: 'Dönüşüm', desc: 'Kalıcı alışkanlıklar edin' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text-900 mb-1">{item.title}</h3>
                <p className="text-sm text-text-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-900 mb-4">Kullanıcılarımız Ne Diyor?</h2>
            <p className="text-lg text-text-600">Binlerce mutlu kullanıcıya katılın</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-background-50 rounded-xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-text-700 mb-6">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-900">{testimonial.name}</p>
                    <p className="text-sm text-text-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-background-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-900 mb-4">Basit, Şeffaf Fiyatlandırma</h2>
            <p className="text-lg text-text-600">Sizin için en uygun planı seçin</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl p-8 border-2 ${plan.popular ? 'border-primary-500 shadow-lg' : 'border-background-200'
                  }`}
              >
                {plan.popular && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                    En Popüler
                  </span>
                )}
                <h3 className="text-2xl font-bold text-text-900 mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold text-primary-600 mb-6">
                  {plan.price}
                  <span className="text-lg text-text-500">/ay</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-text-700">
                      <CheckCircle2 className="w-5 h-5 text-success-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className={`w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-base ${plan.popular
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]'
                      : 'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                >
                  Hemen Başla
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section >

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-900 mb-4">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-text-600">Aklınızda soru mu var? Cevaplarımız hazır</p>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-background-50 rounded-lg p-6 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-text-900">
                  {faq.question}
                  <ChevronRight className="w-5 h-5 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-text-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-text-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Günden Güne</h3>
              <p className="text-text-400">
                Bilimsel temelli kişisel gelişim ile hayatınızı dönüştürün.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-text-400">
                <li><Link href="/#features" className="hover:text-white">Özellikler</Link></li>
                <li><Link href="/#pricing" className="hover:text-white">Fiyatlandırma</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-text-400">
                <li><a href="#" className="hover:text-white">Hakkında</a></li>
                <li><a href="#" className="hover:text-white">İletişim</a></li>
                <li><a href="#" className="hover:text-white">Gizlilik</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bağlan</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-primary-400">Twitter</a>
                <a href="#" className="hover:text-primary-400">LinkedIn</a>
                <a href="#" className="hover:text-primary-400">Instagram</a>
              </div>
            </div>
            <p>&copy; {new Date().getFullYear()} Günden Güne. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div >
  );
}
