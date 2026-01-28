'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import SkillTreeComponent from '@/components/SkillTree'
import Motivation from '@/components/Motivation'
import Feedback from '@/components/Feedback'
import ThemeToggle from '@/components/ThemeToggle'
import { getUserProgress, generateSkillTreesForDay } from '@/services/firebase'
import type { SkillTree, Task } from '@/types'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState<any>(null)
  const [skillTrees, setSkillTrees] = useState<SkillTree[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    } else if (user && !user.workingStatus) {
      router.push('/onboarding')
    } else if (user) {
      loadProgress()
    }
  }, [user, loading, router])

  const loadProgress = async () => {
    if (!user) return

    const userProgress = await getUserProgress(user.uid)
    setProgress(userProgress)

    if (userProgress?.skillTrees?.length === 0) {
      const generatedTrees = await generateSkillTreesForDay(user.uid, userProgress?.currentDay || 1, user.interests || [])
      setSkillTrees(generatedTrees)
    } else {
      setSkillTrees(userProgress?.skillTrees || [])
    }
  }

  const handleTaskToggle = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed }
    const updatedTrees = skillTrees.map(tree => ({
      ...tree,
      tasks: tree.tasks.map(t => t.id === task.id ? updatedTask : t),
      completed: tree.tasks.every(t => t.id === task.id ? updatedTask.completed : t.completed)
    }))

    setSkillTrees(updatedTrees)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-text-secondary">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <header className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md border-b border-border-color px-4 lg:px-10 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="size-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              <span className="material-symbols-outlined !text-3xl icon-spin">spa</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block text-text-main transition-colors duration-300 group-hover:text-primary">Günden Güne</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a className="nav-link text-sm font-bold text-primary relative py-2" href="/program">Ağacım</a>
            <a className="nav-link text-sm font-medium text-text-main relative py-2 hover:text-primary" href="/program">Görevler</a>
            <a className="nav-link text-sm font-medium text-text-main relative py-2 hover:text-primary" href="/blog">Topluluk</a>
            <a className="nav-link text-sm font-medium text-text-main relative py-2 hover:text-primary" href="/blog">Rozetler</a>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2 bg-surface-light px-3 py-1.5 rounded-full border border-border-color shadow-sm hover:border-primary/50 transition-all duration-300 hover:scale-105 cursor-default">
              <span className="material-symbols-outlined text-primary text-lg">local_fire_department</span>
              <span className="text-sm font-bold text-text-main">{progress?.streak || 0} Gün</span>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-semibold text-text-main hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-10 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl md:text-4xl font-black text-text-main leading-tight">
                {progress?.currentDay || 1}. Gün: <span className="text-primary">Fiziksel Sağlık</span>
              </h2>
              <span className="text-sm font-medium text-text-secondary bg-surface-light px-3 py-1 rounded-full border border-border-color">
                {progress?.currentDay || 1}/21 Gün
              </span>
            </div>

            {skillTrees.map((tree) => (
              <SkillTreeComponent
                key={tree.id}
                skillTree={tree}
                onTaskToggle={handleTaskToggle}
              />
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex flex-col justify-between hover:border-primary/50 transition-all duration-300 hover-lift group cursor-default relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 bg-primary/10 w-fit p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined icon-bounce">bolt</span>
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-medium text-text-secondary uppercase">Toplam XP</p>
                  <p className="text-2xl font-bold text-text-main transition-transform duration-300 group-hover:scale-105">{progress?.totalPoints || 0}</p>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex flex-col justify-between hover:border-green-500/50 transition-all duration-300 hover-lift group cursor-default relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 bg-green-500/10 w-fit p-2 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined icon-bounce">eco</span>
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-medium text-text-secondary uppercase">Seviye</p>
                  <p className="text-2xl font-bold text-text-main transition-transform duration-300 group-hover:scale-105">Çırak</p>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex flex-col justify-between hover:border-purple-500/50 transition-all duration-300 hover-lift group cursor-default relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 bg-purple-500/10 w-fit p-2 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined icon-bounce">military_tech</span>
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-medium text-text-secondary uppercase">Tamamlanan</p>
                  <p className="text-2xl font-bold text-text-main transition-transform duration-300 group-hover:scale-105">{progress?.completedDays?.length || 0}</p>
                </div>
              </div>
              <div className="bg-surface-light p-4 rounded-xl border border-border-color shadow-sm flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300 hover-lift group cursor-default relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 bg-blue-500/10 w-fit p-2 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined icon-bounce">trending_up</span>
                </div>
                <div className="relative z-10">
                  <p className="text-xs font-medium text-text-secondary uppercase">İlerleme</p>
                  <p className="text-2xl font-bold text-text-main transition-transform duration-300 group-hover:scale-105">{Math.round(((progress?.currentDay || 1) / 21) * 100)}%</p>
                </div>
              </div>
            </div>

            <Motivation />
            <Feedback />
          </div>
        </div>
      </main>
    </div>
  )
}
