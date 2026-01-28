'use client'

import type { SkillTree, Task } from '@/types'

interface SkillTreeProps {
  skillTree: SkillTree
  onTaskToggle: (task: Task) => void
}

export default function SkillTreeComponent({ skillTree, onTaskToggle }: SkillTreeProps) {
  const allTasksCompleted = skillTree.tasks.every(task => task.completed)
  const progress = (skillTree.tasks.filter(t => t.completed).length / skillTree.tasks.length) * 100

  return (
    <div className="bg-surface-light rounded-2xl shadow-soft border border-border-color p-6 mb-6 relative overflow-hidden group transition-all duration-300 hover-lift hover:shadow-lg">
      <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110
            ${allTasksCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
            <span className="material-symbols-outlined text-2xl icon-bounce">
              {allTasksCompleted ? 'check_circle' : getIconByCategory(skillTree.category)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main transition-colors duration-300 group-hover:text-primary">{skillTree.title}</h3>
            <p className="text-sm text-text-secondary transition-colors duration-300 group-hover:text-text-main">{skillTree.category}</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-105
          ${allTasksCompleted
            ? 'bg-green-500 text-white shadow-md'
            : 'bg-primary/10 text-primary group-hover:bg-primary/20'
          }`}>
          {skillTree.tasks.filter(t => t.completed).length}/{skillTree.tasks.length}
        </div>
      </div>

      <p className="text-text-secondary mb-6 transition-colors duration-300 group-hover:text-text-main">{skillTree.description}</p>

      <div className="space-y-3">
        {skillTree.tasks.map((task, index) => (
          <button
            key={task.id}
            onClick={() => onTaskToggle(task)}
            className={`group/task w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-4 relative overflow-hidden
              ${task.completed
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-border-color bg-surface-light hover:border-primary/50 hover:bg-primary/5'
              }`}
          >
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover/task:translate-y-0 transition-transform duration-300" />
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 group-hover/task:scale-110 relative z-10
              ${task.completed ? 'border-green-500 bg-green-500' : 'border-text-secondary group-hover/task:border-primary'}`}>
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`flex-1 font-medium transition-all duration-300 relative z-10 ${task.completed ? 'line-through text-text-secondary' : 'text-text-main group-hover/task:text-primary'}`}>
              {task.title}
            </span>
            {task.completed && (
              <span className="material-symbols-outlined text-green-500 icon-bounce relative z-10">check</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function getIconByCategory(category: string): string {
  const icons: Record<string, string> = {
    'Fiziksel Sağlık': 'fitness_center',
    'Zihinsel Sağlık': 'psychology',
    'Kariyer/Öğrenim': 'school',
    'Sosyal Beceriler': 'groups',
    'Finansal Okuryazarlık': 'account_balance'
  }
  return icons[category] || 'star'
}
