'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

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

  const getCurrentDayProgram = async () => {
    setLoading(true);
    try {
      // Mock data
      // const program = await api.get('/program/current');
      const program: DailyProgram = {
        day: 1,
        tasks: [
          { id: '1', title: 'Sabah Meditasyonu', description: '10 dakika nefes egzersizi', duration: 10, completed: false, day: 1 },
          { id: '2', title: 'Günlük Planlama', description: 'Bugünün hedeflerini yaz', duration: 5, completed: true, day: 1 },
        ],
        totalDuration: 15,
        completedDuration: 5,
        motivationMessage: 'Harika bir başlangıç yap!'
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
  };

  const getDayProgram = async (day: number) => {
    setLoading(true);
    try {
      const program = await api.get(`/program/day/${day}`);
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
  };

  const completeTask = async (taskId: string) => {
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
  };

  const uncompleteTask = async (taskId: string) => {
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
  };

  const submitReflection = async (reflection: string) => {
    try {
      // await api.post('/program/reflection', { reflection });
      console.log('Reflection submitted:', reflection);
    } catch (error) {
      console.error('Error submitting reflection:', error);
      throw error;
    }
  };

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
