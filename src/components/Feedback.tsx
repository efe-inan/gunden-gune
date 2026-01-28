'use client'

import { useState } from 'react'
import { addFeedback } from '@/services/firebase'
import { useAuth } from '@/contexts/AuthContext'

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async () => {
    if (!user || rating === 0) return

    try {
      await addFeedback({
        userId: user.uid,
        rating,
        comment
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Feedback gönderme hatası:', error)
    }
  }

  if (submitted) {
    return (
      <div className="bg-surface-light rounded-2xl shadow-soft border border-border-color p-6 fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 pulse-primary">
            <span className="material-symbols-outlined text-2xl icon-bounce">check_circle</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main">Geri Bildirimin için Teşekkürler!</h3>
            <p className="text-text-secondary text-sm">Yorumun değerlendirildiğinde sana daha iyi bir deneyim sunmak için kullanacağız.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-light rounded-2xl shadow-soft border border-border-color p-6 transition-all duration-300 hover-lift">
      <h3 className="text-xl font-bold text-text-main mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary icon-bounce">feedback</span>
        Geri Bildirim
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-bold text-text-main mb-3 uppercase tracking-wider">
          Deneyimini puanla
        </label>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-5xl transition-all duration-300 group relative
                ${star <= rating ? 'text-yellow-400' : 'text-text-secondary hover:text-yellow-300'}`}
            >
              <span className="block transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12">★</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-text-main mb-3 uppercase tracking-wider">
          Yorumun
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-border-color rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 bg-surface-light text-text-main placeholder-text-secondary/50 focus:scale-100 focus:shadow-lg"
          placeholder="Neleri beğendin? Neleri geliştirmeliyiz?"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover-lift flex items-center justify-center gap-2 relative overflow-hidden group
          ${rating === 0
            ? 'bg-border-color text-text-secondary cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-xl'
          }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">send</span>
          <span>Gönder</span>
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
    </div>
  )
}
