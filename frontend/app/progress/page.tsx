'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { useProgress } from '@/hooks/useProgress';
import { Trophy, Award, Star, Target } from 'lucide-react';
import { Button } from '@/design-system/components/Button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'İlk Adımlar',
    description: 'İlk gününü tamamla',
    icon: '🎯',
  },
  {
    id: '2',
    title: 'Haftalık Savaşçı',
    description: 'Peş peşe 7 gün tamamla',
    icon: '🔥',
  },
  {
    id: '3',
    title: 'Yarı Yol Kahramanı',
    description: '11. güne ulaş',
    icon: '⭐',
  },
  {
    id: '4',
    title: 'Seri Ustası',
    description: '14 günlük seriyi koru',
    icon: '💪',
  },
  {
    id: '5',
    title: 'Görev Şampiyonu',
    description: '50 görev tamamla',
    icon: '✅',
  },
  {
    id: '6',
    title: 'Dönüşüm Tamamlandı',
    description: 'Tüm 21 günü tamamla',
    icon: '🏆',
  },
];

export default function ProgressPage() {
  const { progress, fetchProgress, loading } = useProgress();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const chartData = (viewMode === 'weekly'
    ? progress?.weeklyProgress || []
    : progress?.monthlyProgress || []).map((item) => ({
      name: item.day,
      completed: item.completed,
      total: item.total,
    }));

  return (
    <ProtectedRoute>
      <div className="p-6 lg:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-900 mb-2">İlerlemeniz</h1>
            <p className="text-text-600">Gelişiminizi ve başarılarınızı takip edin</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'weekly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('weekly')}
            >
              Haftalık
            </Button>
            <Button
              variant={viewMode === 'monthly' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('monthly')}
            >
              Aylık
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white">
            <Target className="w-8 h-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Mevcut Gün</p>
            <p className="text-3xl font-bold">{progress?.currentDay || 0} / 21</p>
          </div>

          <div className="bg-gradient-to-br from-success-500 to-success-700 rounded-xl p-6 text-white">
            <Award className="w-8 h-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Tamamlanan Görevler</p>
            <p className="text-3xl font-bold">{progress?.completedTasks || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl p-6 text-white">
            <Star className="w-8 h-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Tamamlanma</p>
            <p className="text-3xl font-bold">{progress?.completionRate || 0}%</p>
          </div>

          <div className="bg-gradient-to-br from-warning-500 to-warning-700 rounded-xl p-6 text-white">
            <Trophy className="w-8 h-8 mb-4 opacity-80" />
            <p className="text-sm opacity-80 mb-1">Başarılar</p>
            <p className="text-3xl font-bold">{progress?.achievements?.length || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressChart
              data={chartData}
              type="line"
              title={`${viewMode === 'weekly' ? 'Haftalık' : 'Aylık'} İlerleme`}
            />
          </div>
          <div>
            <CalendarView />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
          <h2 className="text-2xl font-semibold text-text-900 mb-6">Başarılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const earned = progress?.achievements?.some((a) => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-xl border-2 transition-all ${earned
                    ? 'border-accent-300 bg-accent-50'
                    : 'border-background-200 bg-background-50 opacity-60'
                    }`}
                >
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="font-semibold text-text-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-text-600">{achievement.description}</p>
                  {earned && (
                    <p className="text-xs text-accent-600 mt-4 font-medium">
                      {new Date().toLocaleDateString()} tarihinde kazanıldı
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
