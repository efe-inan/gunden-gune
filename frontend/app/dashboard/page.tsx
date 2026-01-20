'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { TaskList } from '@/components/dashboard/TaskList';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { useProgress } from '@/hooks/useProgress';
import { useProgram } from '@/hooks/useProgram';
import { useUser } from '@/hooks/useUser';
import { Target, BookOpen, TrendingUp, Calendar as CalendarIcon, Flame, Play } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { Button } from '@/design-system/components/Button';

export default function DashboardPage() {
  const { progress, fetchProgress, loading } = useProgress();
  const { currentProgram, getCurrentDayProgram } = useProgram();
  const { getStreak, getCurrentDay } = useUser();

  useEffect(() => {
    fetchProgress();
    getCurrentDayProgram();
  }, [fetchProgress, getCurrentDayProgram]);

  const streak = getStreak();
  const currentDay = getCurrentDay();

  const chartData = (progress?.weeklyProgress || []).map((item) => ({
    name: item.day,
    completed: item.completed,
    total: item.total,
  }));

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-900 mb-2">Tekrar Hoş Geldiniz!</h1>
          <p className="text-text-600">Dönüşüm yolculuğunuza devam edin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Mevcut Gün"
            value={`${currentDay}. Gün`}
            change="/ 21"
            icon={<Target className="w-6 h-6 text-primary-600" />}
          />
          <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
            <StreakCounter streak={streak} longestStreak={progress?.longestStreak} />
          </div>
          <StatCard
            label="Tamamlanan Görevler"
            value={progress?.completedTasks || 0}
            change={`%${(progress?.completionRate ?? 0)} tamamlandı`}
            changeType={(progress?.completionRate ?? 0) >= 50 ? 'increase' : 'neutral'}
            icon={<BookOpen className="w-6 h-6 text-accent-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressChart
              data={chartData}
              type="line"
              title="Haftalık İlerleme"
              color={colors.primary[500]}
            />
          </div>
          <div>
            <CalendarView />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text-900">Bugünün Görevleri</h2>
              {currentProgram && (
                <Link href="/program">
                  <Button size="sm" leftIcon={<Play className="w-4 h-4" />}>
                    Güne Başla
                  </Button>
                </Link>
              )}
            </div>
            {currentProgram?.tasks && currentProgram.tasks.length > 0 ? (
              <TaskList
                tasks={currentProgram.tasks}
                onTaskToggle={() => { }}
              />
            ) : (
              <p className="text-text-500 text-center py-8">Bugün için görev yok</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Günlük Motivasyon</h2>
            <p className="text-lg mb-6 opacity-90">
              {currentProgram?.motivationMessage || "İstikrar mükemmel olmak değildir. Her gün orada olmakla ilgilidir."}
            </p>
            <Button variant="secondary" fullWidth>
              Hedefleri Güncelle
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
