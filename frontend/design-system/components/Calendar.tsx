import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeIn } from '../animations';

interface CalendarProps {
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  highlightedDates?: Date[];
  disabledDates?: Date[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateChange,
  minDate,
  maxDate,
  highlightedDates = [],
  disabledDates = [],
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some((d) => isSameDay(d, date));
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some((d) => isSameDay(d, date));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!isDateDisabled(newDate) && onDateChange) {
      onDateChange(newDate);
    }
  };

  const renderDays = () => {
    const days = [];
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          key={i}
          className={`text-xs font-medium text-[${colors.text[100]}] text-center py-2`}
        >
          {dayNames[i]}
        </div>
      );
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isHighlighted = isDateHighlighted(date);
      const isDisabled = isDateDisabled(date);

      days.push(
        <motion.button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={isDisabled}
          whileHover={!isDisabled ? { scale: 1.1 } : undefined}
          whileTap={!isDisabled ? { scale: 0.95 } : undefined}
          className={`
            relative
            w-10 h-10
            flex items-center justify-center
            text-sm font-medium
            rounded-lg
            transition-all
            duration-200
            ${isSelected
              ? `bg-[${colors.primary[500]}] text-white`
              : isHighlighted
                ? `bg-[${colors.primary[100]}] text-[${colors.primary[500]}]`
                : isDisabled
                  ? `text-[${colors.text[100]}] cursor-not-allowed opacity-50`
                  : `text-[${colors.text[400]}] hover:bg-[${colors.background[300]}]`
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={`inline-block bg-[${colors.background[100]}] rounded-xl p-4 border border-[${colors.background[400]}] ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className={`p-2 rounded-lg hover:bg-[${colors.background[300]}] transition-colors duration-200`}
        >
          <svg className="w-5 h-5 text-[${colors.text[400]}]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className={`text-lg font-semibold text-[${colors.text[400]}]`}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className={`p-2 rounded-lg hover:bg-[${colors.background[300]}] transition-colors duration-200`}
        >
          <svg className="w-5 h-5 text-[${colors.text[400]}]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </motion.div>
  );
};