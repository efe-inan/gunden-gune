import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp } from '../animations';

interface Day {
  day: number;
  title: string;
  description: string;
  completed?: boolean;
  locked?: boolean;
  duration?: string;
  icon?: React.ReactNode;
}

interface ProgramLayoutProps {
  title: string;
  description: string;
  progress: number;
  days: Day[];
  activeDay: number;
  onDaySelect: (day: number) => void;
  onCompleteDay: (day: number) => void;
  children: React.ReactNode;
  className?: string;
}

export const ProgramLayout: React.FC<ProgramLayoutProps> = ({
  title,
  description,
  progress,
  days,
  activeDay,
  onDaySelect,
  onCompleteDay,
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-[${colors.background[50]}] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold text-[${colors.text[400]}] mb-2`}>
            {title}
          </h1>
          <p className={`text-[${colors.text[100]}] mb-4`}>
            {description}
          </p>
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className={`text-[${colors.text[300]}]`}>Progress</span>
              <span className={`text-[${colors.primary[500]}] font-medium`}>
                {progress}%
              </span>
            </div>
            <div className="h-2 bg-[${colors.background[400]}] rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-[${colors.primary[500]}]`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              {children}
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              variants={fadeInUp}
              className={`bg-[${colors.background[100]}] rounded-xl border border-[${colors.background[400]}] p-6 sticky top-8`}
            >
              <h2 className={`text-lg font-semibold text-[${colors.text[400]}] mb-4`}>
                Program Days
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {days.map((day) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    isActive={activeDay === day.day}
                    onSelect={() => onDaySelect(day.day)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DayCardProps {
  day: Day;
  isActive: boolean;
  onSelect: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, isActive, onSelect }) => {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full
        text-left
        p-4
        rounded-lg
        transition-all
        duration-200
        ${
          isActive
            ? `bg-[${colors.primary[100]}] border-2 border-[${colors.primary[500]}]`
            : `bg-[${colors.background[200]}] border-2 border-transparent hover:border-[${colors.background[400]}]`
        }
        ${day.locked ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={day.locked}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            w-10 h-10
            rounded-full
            flex items-center justify-center
            flex-shrink-0
            ${
              day.completed
                ? `bg-[${colors.success[400]}] text-white`
                : isActive
                ? `bg-[${colors.primary[500]}] text-white`
                : `bg-[${colors.background[400]}] text-[${colors.text[300]}]`
            }
          `}
        >
          {day.completed ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="font-medium">{day.day}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-medium ${
              isActive ? `text-[${colors.primary[500]}]` : `text-[${colors.text[400]}]`
            }`}
          >
            {day.title}
          </h3>
          <p className={`text-sm mt-1 text-[${colors.text[100]}] line-clamp-2`}>
            {day.description}
          </p>
          {day.duration && (
            <div className="flex items-center gap-1 mt-2">
              <svg
                className={`w-3 h-3 text-[${colors.text[100]}]`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-xs text-[${colors.text[100]}]`}>
                {day.duration}
              </span>
            </div>
          )}
        </div>

        {day.icon && !isActive && (
          <span className={`text-[${colors.primary[400]}]`}>{day.icon}</span>
        )}
      </div>
    </motion.button>
  );
};

interface DayContentProps {
  day: Day;
  children: React.ReactNode;
  onMarkComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export const DayContent: React.FC<DayContentProps> = ({
  day,
  children,
  onMarkComplete,
  onNext,
  onPrevious,
  className = '',
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className={`bg-[${colors.background[100]}] rounded-xl border border-[${colors.background[400]}] p-8 ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full bg-[${colors.primary[100]}] text-[${colors.primary[500]}]`}>
              Day {day.day}
            </span>
            {day.duration && (
              <span className={`text-xs text-[${colors.text[100]}]`}>
                {day.duration}
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-bold text-[${colors.text[400]}]`}>
            {day.title}
          </h2>
          <p className={`mt-2 text-[${colors.text[100]}]`}>
            {day.description}
          </p>
        </div>

        {day.completed && (
          <div className={`p-2 rounded-full bg-[${colors.success[100]}]`}>
            <svg className={`w-6 h-6 text-[${colors.success[400]}]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        {children}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-[${colors.background[400]}]">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 text-[${colors.text[400]}] hover:bg-[${colors.background[200]}] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Day
          </button>
        )}

        <div className="flex gap-3 ml-auto">
          {onMarkComplete && !day.completed && (
            <motion.button
              onClick={onMarkComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-2.5 bg-[${colors.success[400]}] text-white font-medium rounded-lg hover:bg-[${colors.success[500]}] transition-colors`}
            >
              Mark Complete
            </motion.button>
          )}
          {onNext && (
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-2.5 bg-[${colors.primary[500]}] text-white font-medium rounded-lg hover:bg-[${colors.primary[600]}] transition-colors`}
            >
              Next Day
              <svg className="w-5 h-5 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};