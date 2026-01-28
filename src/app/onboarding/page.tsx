'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { updateUser } from '@/services/firebase'
import ThemeToggle from '@/components/ThemeToggle'

interface OnboardingData {
  workingStatus: string
  studentStatus: string
  freeTime: string
  interests: string[]
  goals: string
}

const QUESTIONS = [
  {
    id: 'workingStatus',
    question: 'Şu anki çalışma durumunuz nedir?',
    options: [
      { value: 'Çalışıyorum', desc: 'Tam zamanlı veya yarı zamanlı bir işte aktif olarak çalışıyorum.', icon: 'work' },
      { value: 'Öğrenciyim', desc: 'Lise, üniversite veya yüksek lisans öğrencisiyim.', icon: 'school' },
      { value: 'İş Arıyorum', desc: 'Şu anda çalışmıyorum ama aktif olarak iş arayışındayım.', icon: 'search' },
      { value: 'Emekliyim / Çalışmıyorum', desc: 'Kendime ayıracak bol vaktim var, emekliyim veya ev hanımıyım.', icon: 'chair' }
    ]
  },
  {
    id: 'studentStatus',
    question: 'Eğitim durumunuz nedir?',
    options: [
      { value: 'Lise öğrencisiyim', desc: 'Halihazırda lisede eğitim görüyorum.', icon: 'menu_book' },
      { value: 'Üniversite öğrencisiyim', desc: 'Yükseköğretim kurumunda okuyorum.', icon: 'school' },
      { value: 'Lisans mezunuyum', desc: 'Lisans eğitimimi tamamladım.', icon: 'workspace_premium' },
      { value: 'Yüksek lisans/doktora', desc: 'Lisansüstü eğitimime devam ediyorum.', icon: 'science' }
    ]
  },
  {
    id: 'freeTime',
    question: 'Günde ne kadar boş zamanın oluyor?',
    options: [
      { value: '30 dakika - 1 saat', desc: 'Günde 30 dakika ile 1 saat arası vaktim var.', icon: 'schedule' },
      { value: '1 - 2 saat', desc: 'Günde 1 ile 2 saat arası boş zamanım var.', icon: 'timer' },
      { value: '2 - 4 saat', desc: 'Günde 2 ile 4 saat arası vaktim var.', icon: 'hourglass_empty' },
      { value: '4 saatten fazla', desc: 'Günde 4 saatten fazla boş zamanım var.', icon: 'all_inclusive' }
    ]
  },
  {
    id: 'interests',
    question: 'Hangi alanlardan ilgilendiğini seç (çoklu seçim):',
    options: [
      { value: 'Fiziksel Sağlık', desc: 'Egzersiz, uyku, beslenme', icon: 'fitness_center' },
      { value: 'Zihinsel Sağlık', desc: 'Meditasyon, okuma, odaklanma', icon: 'psychology' },
      { value: 'Kariyer/Öğrenim', desc: 'Yeni beceriler, kariyer gelişimi', icon: 'work' },
      { value: 'Sosyal Beceriler', desc: 'İletişim, ilişkiler, topluluk', icon: 'groups' },
      { value: 'Finansal Okuryazarlık', desc: 'Bütçe, yatırım, finansal planlama', icon: 'account_balance' }
    ],
    multiple: true
  },
  {
    id: 'goals',
    question: 'En önemli hedefin nedir?',
    options: [
      { value: 'Daha sağlıklı olmak', desc: 'Fiziksel ve mental sağlıma odaklanmak.', icon: 'favorite' },
      { value: 'Yeni beceriler öğrenmek', desc: 'Kişisel ve profesyonel gelişim.', icon: 'auto_stories' },
      { value: 'Daha verimli çalışmak', desc: 'Üretkenlik ve zaman yönetimi.', icon: 'trending_up' },
      { value: 'Daha iyi finansal durum', desc: 'Para yönetimi ve finansal özgürlük.', icon: 'savings' },
      { value: 'Daha mutlu olmak', desc: 'İçsel huzur ve yaşam memnuniyeti.', icon: 'sentiment_satisfied' }
    ]
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<OnboardingData>({
    workingStatus: '',
    studentStatus: '',
    freeTime: '',
    interests: [],
    goals: ''
  })
  const { user } = useAuth()
  const router = useRouter()

  const handleOptionSelect = (option: string, multiple: boolean = false) => {
    const currentQuestion = QUESTIONS[currentStep]

    if (multiple) {
      setAnswers(prev => {
        const current = prev[currentQuestion.id as keyof OnboardingData] as string[]
        if (current.includes(option)) {
          return {
            ...prev,
            [currentQuestion.id]: current.filter(item => item !== option)
          }
        }
        return {
          ...prev,
          [currentQuestion.id]: [...current, option]
        }
      })
    } else {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: option
      }))
    }
  }

  const handleNext = () => {
    const currentQuestion = QUESTIONS[currentStep]
    const answer = answers[currentQuestion.id as keyof OnboardingData]

    if (currentQuestion.multiple) {
      const arrayAnswer = answer as string[]
      if (arrayAnswer.length === 0) return
    } else if (!answer) {
      return
    }

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    try {
      await updateUser(user.uid, answers)
      router.push('/dashboard')
    } catch (error) {
      console.error('Onboarding hatası:', error)
    }
  }

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background-light relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary font-bold text-sm tracking-wider uppercase">Kişisel Analiz</p>
              <h2 className="text-2xl font-bold mt-1 text-text-main">Sizi daha yakından tanıyalım</h2>
            </div>
            <div className="flex items-center gap-2 bg-surface-light px-3 py-1.5 rounded-full border border-border-color shadow-sm">
              <span className="text-sm font-bold text-text-main">Adım {currentStep + 1}</span>
              <span className="text-sm text-text-secondary">/ {QUESTIONS.length}</span>
            </div>
          </div>

          <div className="h-2 w-full bg-border-color/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-surface-light rounded-2xl p-6 md:p-10 shadow-soft border border-border-color">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-text-main leading-tight mb-3">
              {QUESTIONS[currentStep].question}
            </h3>
          </div>

          <div className="space-y-4">
            {QUESTIONS[currentStep].options.map((option) => {
              const isSelected = QUESTIONS[currentStep].multiple
                ? (answers[QUESTIONS[currentStep].id as keyof OnboardingData] as string[]).includes(option.value)
                : answers[QUESTIONS[currentStep].id as keyof OnboardingData] === option.value

              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value, QUESTIONS[currentStep].multiple || false)}
                  className={`option-card w-full flex items-start md:items-center gap-4 p-5 rounded-xl border transition-all duration-300 group relative overflow-hidden
                    ${isSelected
                      ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10'
                      : 'border-border-color bg-surface-light hover:border-primary hover-scale hover-lift'
                    }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110
                    ${isSelected ? 'bg-primary/20 text-primary' : 'bg-border-color/30 text-text-secondary group-hover:bg-primary/10 group-hover:text-primary'}`}>
                    <span className="material-symbols-outlined icon-bounce">{option.icon}</span>
                  </div>
                  <div className="flex-grow text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-lg transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-text-main group-hover:text-primary'}`}>{option.value}</h4>
                      {QUESTIONS[currentStep].multiple && (
                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-primary bg-primary' : 'border-border-color group-hover:border-primary'}`} />
                      )}
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${isSelected ? 'text-text-main' : 'text-text-secondary group-hover:text-text-main'}`}>{option.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-text-secondary hover:text-text-main hover:bg-black/5 transition-all duration-300 font-semibold
              ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover-lift group relative overflow-hidden'}`}
          >
            <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:-translate-x-1">arrow_back</span>
            <span>Ana Sayfaya Dön</span>
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover-lift relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              {currentStep < QUESTIONS.length - 1 ? 'Devam Et' : 'Planımı Oluştur'}
              <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
