'use client';

import { Flame } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  streak: number;
  longestStreak?: number;
}

export function StreakCounter({ streak, longestStreak }: StreakCounterProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 21) return colors.primary[500];
    if (streak >= 14) return colors.primary[600];
    if (streak >= 7) return colors.primary[700];
    return colors.primary[800];
  };

  const streakColor = getStreakColor(streak);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${streakColor}20` }}
      >
        <Flame
          className="w-6 h-6"
          style={{ color: streakColor }}
        />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-900">{streak}</p>
        <p className="text-sm text-text-500">Gün Serisi</p>
      </div>
      {longestStreak && longestStreak > streak && (
        <div className="ml-auto text-right">
          <p className="text-sm text-text-500">En İyi</p>
          <p className="text-lg font-semibold text-text-700">{longestStreak}</p>
        </div>
      )}
    </motion.div>
  );
}
