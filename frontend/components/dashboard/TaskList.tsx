'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { accordionContent } from '@/design-system/animations';

interface Task {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string) => void;
}

export function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          className={`bg-white rounded-lg border ${task.completed
              ? 'border-success-200 bg-success-50/30'
              : 'border-background-200'
            } overflow-hidden`}
        >
          <button
            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            className="w-full px-4 py-4 flex items-center gap-4 hover:bg-background-50 transition-colors"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTaskToggle(task.id);
              }}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                  ? 'bg-success-500 border-success-500'
                  : 'border-background-300 hover:border-primary-500'
                }`}
            >
              {task.completed && <Check className="w-4 h-4 text-white" />}
            </button>
            <div className="flex-1 text-left">
              <h4 className={`font-medium ${task.completed ? 'text-text-500 line-through' : 'text-text-900'}`}>
                {task.title}
              </h4>
              <p className="text-sm text-text-500">{task.duration} dk</p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-text-400 transition-transform ${expandedTask === task.id ? 'rotate-180' : ''
                }`}
            />
          </button>
          <AnimatePresence>
            {expandedTask === task.id && (
              <motion.div
                variants={accordionContent}
                initial="hidden"
                animate="visible"
                className="px-4 pb-4 border-t border-background-100 pt-4"
              >
                <p className="text-text-600 text-sm">{task.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
