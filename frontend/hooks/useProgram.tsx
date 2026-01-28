'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api } from '@/lib/api';
import { programContent } from '@/data/programContent';

interface Task {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  day: number;
}

interface DailyProgram {
  day: number;
  tasks: Task[];
  totalDuration: number;
  completedDuration: number;
  motivationMessage: string;
}

interface ProgramContextType {
  currentProgram: DailyProgram | null;
  loading: boolean;
  getCurrentDayProgram: () => Promise<DailyProgram>;
  completeTask: (taskId: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  submitReflection: (reflection: string) => Promise<void>;
  getDayProgram: (day: number) => Promise<DailyProgram>;
}

const ProgramContext = createContext<ProgramContextType | undefined>(undefined);

export function ProgramProvider({ children }: { children: ReactNode }) {
  const [currentProgram, setCurrentProgram] = useState<DailyProgram | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentDayProgram = useCallback(async () => {
    setLoading(true);
    try {
      // In a real app, we would fetch the user's current day from the backend
      // For now, let's assume day 1 or get from local storage/context
      const currentDay = 1;

      const dayContent = programContent.find(p => p.day === currentDay);

      if (!dayContent) {
        throw new Error('Program content not found');
      }

      const program: DailyProgram = {
        day: dayContent.day,
        tasks: dayContent.tasks.map(t => ({
          ...t,
          completed: false, // In real app, fetch completion status
          day: dayContent.day
        })),
        totalDuration: dayContent.tasks.reduce((acc, t) => acc + t.duration, 0),
        completedDuration: 0,
        motivationMessage: dayContent.motivationMessage
      };

      setCurrentProgram(program);
      return program;
    } catch (error) {
      console.error('Error fetching program:', error);
      // throw error;
      return null as any;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDayProgram = useCallback(async (day: number) => {
    setLoading(true);
    try {
      const dayContent = programContent.find(p => p.day === day);

      if (!dayContent) {
        // Fallback if day not found
        return null as any;
      }

      // Transform to DailyProgram format
      const program: DailyProgram = {
        day: dayContent.day,
        tasks: dayContent.tasks.map(t => ({
          ...t,
          completed: false,
          day: dayContent.day
        })),
        totalDuration: dayContent.tasks.reduce((acc, t) => acc + t.duration, 0),
        completedDuration: 0,
        motivationMessage: dayContent.motivationMessage
      };

      if (day === currentProgram?.day) {
        setCurrentProgram(program);
      }
      return program;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [currentProgram?.day]);

  const completeTask = useCallback(async (taskId: string) => {
    try {
      // await api.post('/program/complete-task', { taskId });
      if (currentProgram) {
        setCurrentProgram({
          ...currentProgram,
          tasks: currentProgram.tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
          ),
          completedDuration: currentProgram.completedDuration +
            (currentProgram.tasks.find(t => t.id === taskId)?.duration || 0),
        });
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }, [currentProgram]);

  const uncompleteTask = useCallback(async (taskId: string) => {
    try {
      // await api.post('/program/uncomplete-task', { taskId });
      if (currentProgram) {
        setCurrentProgram({
          ...currentProgram,
          tasks: currentProgram.tasks.map(task =>
            task.id === taskId ? { ...task, completed: false } : task
          ),
          completedDuration: currentProgram.completedDuration -
            (currentProgram.tasks.find(t => t.id === taskId)?.duration || 0),
        });
      }
    } catch (error) {
      console.error('Error uncompleting task:', error);
      throw error;
    }
  }, [currentProgram]);

  const submitReflection = useCallback(async (reflection: string) => {
    try {
      // await api.post('/program/reflection', { reflection });
      console.log('Reflection submitted:', reflection);
    } catch (error) {
      console.error('Error submitting reflection:', error);
      throw error;
    }
  }, []);

  return (
    <ProgramContext.Provider
      value={{
        currentProgram,
        loading,
        getCurrentDayProgram,
        completeTask,
        uncompleteTask,
        submitReflection,
        getDayProgram,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
}

export function useProgram() {
  const context = useContext(ProgramContext);
  if (context === undefined) {
    throw new Error('useProgram must be used within a ProgramProvider');
  }
  return context;
}
