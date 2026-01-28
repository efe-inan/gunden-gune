'use client'

import { useState } from 'react'

const MOTIVATIONS = [
  { title: 'Küçük adımlar, büyük değişiklikler.', text: 'Her gün bir adım ileri.' },
  { title: 'Tutku yolculuktur.', text: 'Hedefe değil, gelişimine odaklan.' },
  { title: 'Zamanın en iyisi şimdi.', text: 'Gelecek için bugün başla.' },
  { title: 'Kendine güven.', text: 'Yapabileceğini biliyorsun.' },
  { title: 'İlerleme, mükemmellikten daha iyidir.', text: 'Her gün biraz daha iyileş.' },
  { title: 'Kendi yolunu çiz.', text: 'Başarı senin hikayen.' },
  { title: 'Sabır mükemmelliğin ön koşuludur.', text: 'Zamanı tanı.' },
  { title: 'Cesaret, korkunun olumsuzluk.', text: 'Fakat korkuyla birlikte.' },
  { title: 'Kendi potansiyelinin sınırlarını zorla.', text: 'Neler yapabileceğine şaşıracaksın.' },
  { title: 'Her gün yeni bir başlangıç.', text: 'Geçmişe bakma, geleceğe odaklan.' },
  { quote: '"Bir ağaç dikmek için en iyi zaman 20 yıl önceydi. İkinci en iyi zaman ise şimdi."', author: 'Çin Atasözü' },
  { quote: '"Sessizlik boş değildir, cevaplarla doludur."', author: 'Kendin' }
]

export default function Motivation() {
  const [currentMotivation] = useState(() => 
    MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]
  )

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8d6e63] to-[#5d4037] p-6 md:p-8 text-white shadow-lg transition-all duration-300 hover-lift hover:shadow-xl group">
      <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/3 -translate-y-1/3 transition-transform duration-500 group-hover:rotate-12">
        <span className="material-symbols-outlined !text-9xl rotate-slow">format_quote</span>
      </div>
      <div className="relative z-10">
        {currentMotivation.quote ? (
          <>
            <p className="text-sm font-medium italic mb-2 opacity-90 leading-relaxed fade-in">
              {currentMotivation.quote}
            </p>
            <p className="text-xs font-bold text-orange-200 fade-in-up">— {currentMotivation.author}</p>
          </>
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2 fade-in">{currentMotivation.title}</h3>
            <p className="text-white/90 fade-in-up">{currentMotivation.text}</p>
          </>
        )}
      </div>
    </div>
  )
}
