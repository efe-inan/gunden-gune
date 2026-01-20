import React from 'react';
import { motion } from 'framer-motion';
import { progressFill } from '../animations';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className = '',
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    error: 'bg-error-400',
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className={`relative w-full ${sizes[size]} bg-background-400 rounded-full overflow-hidden`}>
        <motion.div
          className={`absolute top-0 left-0 h-full ${colorClasses[color]} rounded-full`}
          variants={animated ? progressFill : undefined}
          initial={animated ? "initial" : undefined}
          animate={animated ? "animate" : undefined}
          custom={percentage}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-text-300">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
  className?: string;
  animated?: boolean;
}

// Map color names to Tailwind color variables (or hex values if we can't use classes in SVG props directly easily without CSS variables)
// Since we are in SVG land, 'stroke' expects a color string. 
// Standard Tailwind classes like 'stroke-primary-500' work if configured in tailwind.config.ts correctly with CSS variables or if they map to valid colors.
// Yes, 'stroke-primary-500' should work if we apply it as a class.
// But Framer Motion `stroke` prop might expect a color value for interpolation? 
// If we use className for static colors it works. 
// For `colorClasses` which was returning hex codes from `colors.ts`, we need to change how we apply it.
// We can use `className={`... stroke-${color}-500 ...`}` instead of `stroke={colorClasses[color]}`.

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showLabel = true,
  labelPosition = 'inside',
  className = '',
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClassMap = {
    primary: 'text-primary-500',
    success: 'text-success-400',
    warning: 'text-warning-400',
    error: 'text-error-400',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-background-400"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={`${colorClassMap[color]}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animated ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showLabel && (
        <div
          className={`absolute flex items-center justify-center font-semibold text-text-400 ${labelPosition === 'inside' ? '' : '-bottom-8'
            }`}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};