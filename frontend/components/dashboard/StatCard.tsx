'use client';

import { motion } from 'framer-motion';
import { colors } from '@/design-system/colors';
import { fadeInUp, hoverScale } from '@/design-system/animations';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColors = {
    increase: 'text-success-600',
    decrease: 'text-error-600',
    neutral: 'text-text-500',
  };

  return (
    <motion.div
      variants={fadeInUp as any}
      whileHover={hoverScale.hover as any}
      className="bg-white rounded-xl p-6 shadow-sm border border-background-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-500">{label}</p>
          <p className="text-3xl font-semibold text-text-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
