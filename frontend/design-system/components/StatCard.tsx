import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { fadeInUp } from '../animations';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  size = 'md',
  className = '',
}) => {
  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    error: 'bg-error-400',
  };

  const changeTextClass = change?.type === 'increase' ? 'text-success-400' : 'text-error-400';

  const sizes = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={`bg-background-100 rounded-xl border border-background-400 ${sizes[size]} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-100 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-text-400">
            {value}
          </h3>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-medium ${changeTextClass}`}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-xs text-text-100">
                from last month
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-10`}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface StatGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatGrid: React.FC<StatGridProps> = ({
  children,
  cols = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-4 ${className}`}>
      {children}
    </div>
  );
};

interface ProgressStatProps {
  title: string;
  value: number;
  max: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const ProgressStat: React.FC<ProgressStatProps> = ({
  title,
  value,
  max,
  label,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    error: 'bg-error-400',
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={`bg-background-100 rounded-xl border border-background-400 p-5 ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-text-100">
          {title}
        </p>
        {label && (
          <span className="text-xs text-text-100">
            {label}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-background-400 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colorClasses[color]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-sm font-semibold text-text-400 whitespace-nowrap">
          {Math.round(percentage)}%
        </span>
      </div>
    </motion.div>
  );
};

interface MiniStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
  className?: string;
}

export const MiniStat: React.FC<MiniStatProps> = ({
  label,
  value,
  icon,
  trend,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {icon && (
        <div className="p-2 rounded-lg bg-primary-100">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs text-text-100">
          {label}
        </p>
        <p className="text-lg font-semibold text-text-400">
          {value}
        </p>
      </div>
      {trend && (
        <span
          className={`text-sm font-medium ${trend.type === 'up'
              ? 'text-success-400'
              : 'text-error-400'
            }`}
        >
          {trend.type === 'up' ? '↑' : '↓'} {trend.value}%
        </span>
      )}
    </div>
  );
};