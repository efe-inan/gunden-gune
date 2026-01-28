'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock as LockIcon } from 'lucide-react';
import { colors } from '@/design-system/colors';

interface Day {
  day: number;
  date: string;
  completed: boolean;
  locked: boolean;
}

interface DaySelectorProps {
  days: Day[];
  currentDay: number;
  onDaySelect: (day: number) => void;
}

export function DaySelector({ days, currentDay, onDaySelect }: DaySelectorProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
      <h3 className="text-lg font-semibold text-text-900 mb-4">21 Günlük Yolculuk</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <motion.button
            key={day.day}
            whileHover={{ scale: day.locked ? 1 : 1.05 }}
            whileTap={{ scale: day.locked ? 1 : 0.95 }}
            onClick={() => !day.locked && onDaySelect(day.day)}
            disabled={day.locked}
            className={`
              aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all relative overflow-hidden
              ${day.locked ? 'opacity-40 cursor-not-allowed bg-background-100' : ''}
              ${day.completed && !day.locked ? 'bg-success-100 text-success-700' : ''}
              ${!day.completed && !day.locked && day.day === currentDay ? 'bg-primary-500 text-white' : ''}
              ${!day.completed && !day.locked && day.day !== currentDay ? 'bg-background-50 hover:bg-background-100 text-text-700' : ''}
            `}
          >
            {day.day === currentDay && !day.completed && (
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            )}
            <span className="text-lg font-bold">{day.day}</span>
            {day.locked && <LockIcon className="w-3 h-3" />}
            {day.completed && <Check className="w-4 h-4" />}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
