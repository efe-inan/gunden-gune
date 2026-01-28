import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInDown } from '../animations';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Seçiniz...',
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex];
          if (!option.disabled) {
            onChange(option.value);
            setIsOpen(false);
          }
        } else {
          setIsOpen(!isOpen);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : prev
          );
          e.preventDefault();
        }
        break;
    }
  };

  const borderColor = error
    ? 'border-error-400'
    : isOpen
      ? 'border-primary-500'
      : 'border-background-400';

  const hoverStyle = disabled ? '' : 'hover:border-primary-400';

  return (
    <div
      ref={dropdownRef}
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full px-4 py-2.5
          bg-background-100
          border-2
          ${borderColor}
          rounded-lg
          text-text-400
          text-left
          transition-all
          duration-200
          flex
          items-center
          justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : hoverStyle}
          focus:outline-none
        `}
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? '' : 'text-text-100'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <motion.svg
          className="w-5 h-5 text-text-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-10 w-full mt-1
              max-h-60 overflow-auto
              bg-background-100
              border border-background-400
              rounded-lg
              shadow-lg
              focus:outline-none
            `}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              const optionStyles = option.disabled
                ? 'text-text-100 cursor-not-allowed opacity-50'
                : isSelected
                  ? 'bg-primary-50 text-primary-500'
                  : isHighlighted
                    ? 'bg-background-300 text-text-400'
                    : 'text-text-300 hover:bg-background-300';

              return (
                <li
                  key={option.value}
                  onClick={() => !option.disabled && onChange(option.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!option.disabled) onChange(option.value);
                    }
                  }}
                  className={`
                    px-4 py-2
                    cursor-pointer
                    transition-colors
                    duration-150
                    flex
                    items-center
                    gap-2
                    ${optionStyles}
                  `}
                >
                  {option.icon}
                  {option.label}
                  {isSelected && (
                    <motion.svg
                      className="w-4 h-4 ml-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};