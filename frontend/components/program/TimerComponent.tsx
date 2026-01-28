'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { colors } from '@/design-system/colors';

interface TimerProps {
  duration?: number;
  onComplete?: () => void;
}

export function Timer({ duration = 60, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval!);
  }, [isActive, timeLeft, onComplete]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke={colors.background[300]}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke={colors.primary[500]}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-8 h-8 text-primary-600 mb-2" />
          <span className="text-4xl font-bold text-text-900">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggle}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {isActive ? 'Duraklat' : 'Başlat'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 bg-background-200 text-text-700 rounded-lg hover:bg-background-300 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
