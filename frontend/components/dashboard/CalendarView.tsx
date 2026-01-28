'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors } from '@/design-system/colors';
import { addDays, isToday, formatDate } from '@/lib/date-utils';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  completedDays?: number[];
}

export function CalendarView({ selectedDate, onDateSelect, completedDays = [] }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    if (onDateSelect) {
      onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    }
  };

  const isCompleted = (day: number) => completedDays.includes(day);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-background-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-900">
          {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-background-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-background-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-text-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
          const isDayToday = isToday(date);
          const dayCompleted = isCompleted(day);

          return (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                ${isSelected ? 'bg-primary-500 text-white' : ''}
                ${dayCompleted && !isSelected ? 'bg-success-100 text-success-700' : ''}
                ${!isSelected && !dayCompleted ? 'hover:bg-background-100 text-text-700' : ''}
                ${isDayToday && !isSelected ? 'ring-2 ring-primary-300' : ''}
              `}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
