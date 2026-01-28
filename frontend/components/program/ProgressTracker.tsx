'use client';

import { CheckCircle2 } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  current: number;
  total: number;
  showLabel?: boolean;
}

export function ProgressTracker({ current, total, showLabel = true }: ProgressTrackerProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-700">İlerleme</span>
          <span className="text-sm font-semibold text-primary-600">
            {current} / {total} ({Math.round(percentage)}%)
          </span>
        </div>
      )}
      <div className="w-full bg-background-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full relative"
        >
          {percentage >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-1/2"
            >
              <CheckCircle2 className="w-6 h-6 text-success-500" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
