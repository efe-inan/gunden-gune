import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User, UserProgress, SkillTree, Feedback } from '@/types'

export const createUser = async (userId: string, email: string): Promise<void> => {
  await setDoc(doc(db, 'users', userId), {
    id: userId,
    email,
    createdAt: new Date()
  })
}

export const getUser = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data() as User
  }
  return null
}

export const updateUser = async (userId: string, data: Partial<User>): Promise<void> => {
  const docRef = doc(db, 'users', userId)
  await updateDoc(docRef, { ...data, updatedAt: new Date() })
}

export const createSkillTree = async (userId: string, skillTree: Omit<SkillTree, 'id' | 'userId'>): Promise<void> => {
  const docRef = doc(db, 'skillTrees', `${userId}_${skillTree.day}_${skillTree.category}`)
  await setDoc(docRef, {
    id: docRef.id,
    userId,
    ...skillTree
  })
}

export const updateSkillTree = async (skillTreeId: string, data: Partial<SkillTree>): Promise<void> => {
  const docRef = doc(db, 'skillTrees', skillTreeId)
  await updateDoc(docRef, data)
}

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const docRef = doc(db, 'progress', userId)
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProgress
  }
  return null
}

export const initUserProgress = async (userId: string): Promise<void> => {
  await setDoc(doc(db, 'progress', userId), {
    userId,
    currentDay: 1,
    completedDays: [],
    skillTrees: [],
    totalPoints: 0,
    streak: 0,
    lastActiveDate: new Date()
  })
}

export const completeDay = async (userId: string, day: number): Promise<void> => {
  const docRef = doc(db, 'progress', userId)
  await updateDoc(docRef, {
    currentDay: day + 1,
    completedDays: arrayUnion(day)
  })
}

export const addFeedback = async (feedback: Omit<Feedback, 'createdAt'>): Promise<void> => {
  const docRef = doc(db, 'feedback', `${feedback.userId}_${Date.now()}`)
  await setDoc(docRef, {
    ...feedback,
    createdAt: new Date()
  })
}

const SKILL_TEMPLATES = {
  'Fiziksel Sağlık': [
    { title: 'Sabah yürüyüşü', description: '15 dakika dışarıda yürü' },
    { title: 'Su içme hedefi', description: 'Günde 2 litre su iç' },
    { title: 'Uyku düzeni', description: 'Her gün aynı saatte yat ve uyan' }
  ],
  'Zihinsel Sağlık': [
    { title: 'Meditasyon', description: '10 dakika meditasyon yap' },
    { title: 'Şükran defteri', description: 'Her gün 3 şeye şükret' },
    { title: 'Okuma', description: '15 dakika kitap oku' }
  ],
  'Kariyer/Öğrenim': [
    { title: 'Yeni beceri öğrenimi', description: '1 saat yeni bir şey öğren' },
    { title: 'Hedef belirleme', description: 'Haftalık hedeflerini yaz' },
    { title: 'LinkedIn güncelleme', description: 'Profilini güncelle' }
  ],
  'Sosyal Beceriler': [
    { title: 'Birine ulaş', description: 'Uzun zamandır konuşmadığın birini ara' },
    { title: 'Aktif dinleme', description: 'Birini dikkatlice dinle' },
    { title: 'Grup etkinliği', description: 'Bir etkinliğe katıl' }
  ],
  'Finansal Okuryazarlık': [
    { title: 'Harcama analizi', description: 'Son hafta harcamalarını analiz et' },
    { title: 'Bütçe planlaması', description: 'Gelecek ay için bütçe planla' },
    { title: 'Yatırım araştırması', description: 'Yatırım seçeneklerini araştır' }
  ]
}

export const generateSkillTreesForDay = async (userId: string, day: number, interests: string[]): Promise<SkillTree[]> => {
  const selectedCategories = interests.length > 0 ? interests : Object.keys(SKILL_TEMPLATES)
  
  const skillTrees: SkillTree[] = selectedCategories.map((category, index) => {
    const template = SKILL_TEMPLATES[category as keyof typeof SKILL_TEMPLATES][day % 3]
    return {
      id: `${userId}_${day}_${category}`,
      userId,
      day,
      category,
      title: template.title,
      description: template.description,
      tasks: [
        {
          id: `${userId}_${day}_${category}_task1`,
          title: 'Sabah',
          completed: false
        },
        {
          id: `${userId}_${day}_${category}_task2`,
          title: 'Öğle',
          completed: false
        },
        {
          id: `${userId}_${day}_${category}_task3`,
          title: 'Akşam',
          completed: false
        }
      ],
      completed: false
    }
  })

  return skillTrees
}
