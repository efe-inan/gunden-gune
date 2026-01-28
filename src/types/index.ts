export interface User {
  id: string
  email: string
  name?: string
  freeTime?: string
  workingStatus?: string
  studentStatus?: string
  interests?: string[]
  goals?: string
  createdAt: Date
}

export interface SkillTree {
  id: string
  userId: string
  day: number
  category: string
  title: string
  description: string
  tasks: Task[]
  completed: boolean
  completedAt?: Date
}

export interface Task {
  id: string
  title: string
  completed: boolean
  completedAt?: Date
}

export interface UserProgress {
  userId: string
  currentDay: number
  completedDays: number[]
  skillTrees: SkillTree[]
  totalPoints: number
  streak: number
  lastActiveDate: Date
}

export interface Feedback {
  userId: string
  rating: number
  comment: string
  createdAt: Date
}
