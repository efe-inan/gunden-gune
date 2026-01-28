import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp } from '../animations';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputWrapperStyles = `
    relative
    ${fullWidth ? 'w-full' : ''}
  `;

  const borderColor = error
    ? 'border-error-400'
    : isFocused
      ? 'border-primary-500'
      : 'border-background-400';

  const inputStyles = `
    w-full px-4 py-2.5
    bg-background-100
    border-2 ${borderColor}
    rounded-lg
    text-text-400
    placeholder:text-text-100
    transition-all duration-200
    focus:outline-none
    ${leftIcon ? 'pl-11' : ''}
    ${rightIcon ? 'pr-11' : ''}
  `;

  const iconColor = isFocused ? 'text-primary-500' : 'text-text-100';

  const iconStyles = `
    absolute
    top-1/2 -translate-y-1/2
    ${iconColor}
    pointer-events-none
    transition-colors duration-200
  `;

  return (
    <motion.div
      className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-400"
        >
          {label}
        </label>
      )}
      <div className={inputWrapperStyles}>
        {leftIcon && <span className={`${iconStyles} left-3`}>{leftIcon}</span>}
        <input
          id={inputId}
          className={inputStyles}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-100 hover:text-primary-500 transition-colors duration-200"
          >
            {rightIcon}
          </button>
        )}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-primary-500 transition-all duration-200 ${isFocused ? 'w-full' : 'w-0'
            }`}
        />
      </div>
      {(error || helperText) && (
        <p
          className={`text-xs ${error ? 'text-error-400' : 'text-text-100'
            }`}
        >
          {error || helperText}
        </p>
      )}
    </motion.div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  resize = 'vertical',
  className = '',
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const borderColor = error
    ? 'border-error-400'
    : isFocused
      ? 'border-primary-500'
      : 'border-background-400';

  const textareaStyles = `
    w-full px-4 py-2.5
    bg-background-100
    border-2 ${borderColor}
    rounded-lg
    text-text-400
    placeholder:text-text-100
    transition-all duration-200
    focus:outline-none
    resize-${resize}
  `;

  return (
    <motion.div
      className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-text-400"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={`text-xs ${error ? 'text-error-400' : 'text-text-100'
            }`}
        >
          {error || helperText}
        </p>
      )}
    </motion.div>
  );
};