'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api';

interface ProgressData {
  currentDay: number;
  totalDays: number;
  completedTasks: number;
  totalTasks: number;
  streak: number;
  longestStreak: number;
  completionRate: number;
  weeklyProgress: { day: string; completed: number; total: number }[];
  monthlyProgress: { day: string; completed: number; total: number }[];
  achievements: { id: string; title: string; description: string; earnedAt: string }[];
}

interface ProgressContextType {
  progress: ProgressData | null;
  loading: boolean;
  fetchProgress: () => Promise<void>;
  updateProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/progress');
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // throw error; // Don't crash
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async () => {
    await fetchProgress();
  }, [fetchProgress]);

  return (
    <ProgressContext.Provider value={{ progress, loading, fetchProgress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
