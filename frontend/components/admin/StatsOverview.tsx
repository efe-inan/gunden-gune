'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { StatCard } from '../dashboard/StatCard';
import { fadeInUp, staggerContainer } from '@/design-system/animations';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPrograms: number;
  completionRate: number;
  averageCompletionTime?: number;
  achievementsEarned?: number;
}

interface StatsOverviewProps {
  stats: Stats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statsData = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-primary-600" />,
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      change: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total`,
      changeType: 'increase' as any,
      icon: <Target className="w-6 h-6 text-success-600" />,
    },
    {
      label: 'Programs Started',
      value: stats.totalPrograms,
      icon: <BookOpen className="w-6 h-6 text-accent-600" />,
    },
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      change: stats.completionRate > 70 ? 'Excellent!' : 'Improving',
      changeType: (stats.completionRate > 70 ? 'increase' : 'neutral') as any,
      icon: <TrendingUp className="w-6 h-6 text-primary-600" />,
    },
  ];

  const secondaryStats = [
    {
      label: 'Avg. Completion Time',
      value: stats.averageCompletionTime ? `${stats.averageCompletionTime} days` : 'N/A',
      icon: <Clock className="w-6 h-6 text-text-500" />,
    },
    {
      label: 'Achievements Earned',
      value: stats.achievementsEarned || 0,
      icon: <Award className="w-6 h-6 text-accent-600" />,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <motion.div key={stat.label} variants={fadeInUp}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {(stats.averageCompletionTime || stats.achievementsEarned) && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {secondaryStats.map((stat, index) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
