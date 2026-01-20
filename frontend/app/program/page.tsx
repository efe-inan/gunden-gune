'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DaySelector } from '@/components/program/DaySelector';
import { TaskList } from '@/components/dashboard/TaskList';
import { ReflectionForm } from '@/components/program/ReflectionForm';
import { Timer as TimerComponent } from '@/components/program/TimerComponent';
import { ProgressTracker } from '@/components/program/ProgressTracker';
import { useProgram } from '@/hooks/useProgram';
import { useUser } from '@/hooks/useUser';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function ProgramPage() {
  const { currentProgram, getCurrentDayProgram, completeTask, uncompleteTask } = useProgram();
  const { getCurrentDay } = useUser();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const currentDay = getCurrentDay();

  useEffect(() => {
    getCurrentDayProgram();
    setSelectedDay(currentDay);
  }, [getCurrentDayProgram, currentDay]);

  const days = Array.from({ length: 21 }, (_, i) => ({
    day: i + 1,
    date: `${i + 1}. Gün`,
    completed: i < currentDay - 1,
    locked: i > currentDay - 1,
  }));

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
  };

  const handleTaskToggle = (taskId: string) => {
    const task = currentProgram?.tasks.find((t) => t.id === taskId);
    if (task?.completed) {
      uncompleteTask(taskId);
    } else {
      completeTask(taskId);
      setActiveTaskId(taskId);
    }
  };

  const handleTimerComplete = () => {
    if (activeTaskId) {
      completeTask(activeTaskId);
      setActiveTaskId(null);
    }
  };

  const completedTasks = currentProgram?.tasks.filter((t) => t.completed).length || 0;
  const totalTasks = currentProgram?.tasks.length || 0;

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">21 Günlük Programınız</h1>
          <p className="text-text-600">Günlük ilerlemenizi ve görevlerinizi takip edin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <DaySelector
              days={days}
              currentDay={currentDay}
              onDaySelect={handleDaySelect}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text-900">{selectedDay}. Gün</h2>
                <div className="flex items-center gap-2 text-text-600">
                  <Clock className="w-5 h-5" />
                  <span>{currentProgram?.completedDuration || 0} / {currentProgram?.totalDuration || 0} dk</span>
                </div>
              </div>

              <ProgressTracker
                current={completedTasks}
                total={totalTasks}
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
              <h3 className="text-xl font-semibold text-text-900 mb-6">
                Bugünün Görevleri
              </h3>

              {currentProgram?.tasks && currentProgram.tasks.length > 0 ? (
                <TaskList
                  tasks={currentProgram.tasks}
                  onTaskToggle={handleTaskToggle}
                />
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success-500" />
                  <p className="text-text-600">Bugün için tüm görevler tamamlandı!</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
                <h3 className="text-xl font-semibold text-text-900 mb-6">
                  Odaklanma Zamanlayıcısı
                </h3>
                <TimerComponent
                  duration={30}
                  onComplete={handleTimerComplete}
                />
              </div>

              <ReflectionForm />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
