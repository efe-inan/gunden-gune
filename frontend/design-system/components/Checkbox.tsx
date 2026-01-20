import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  error = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const checkboxBorderColor = error
    ? 'border-error-400'
    : isFocused
      ? 'border-primary-500'
      : 'border-text-100';

  const checkboxStateStyles = checked
    ? 'bg-primary-500 border-primary-500'
    : 'bg-transparent';

  const hoverStyles = !disabled && !checked ? 'hover:border-primary-400' : '';

  const checkboxStyles = `
    relative
    w-5
    h-5
    border-2
    rounded
    cursor-pointer
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${checkboxBorderColor}
    ${checkboxStateStyles}
    ${hoverStyles}
  `;

  return (
    <label className={`flex items-center gap-3 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className={checkboxStyles}>
        <motion.svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </motion.svg>
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-text-100' : 'text-text-400'}`}>
          {label}
        </span>
      )}
    </label>
  );
};

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  children,
  orientation = 'vertical',
  className = '',
}) => {
  return (
    <div
      className={`flex ${orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'} ${className}`}
      role="radiogroup"
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioProps>(child)) {
          return React.cloneElement(child, {
            name,
            checked: child.props.value === value,
            onChange: () => onChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface RadioProps {
  value: string;
  name?: string;
  checked?: boolean;
  onChange?: () => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  value,
  name,
  checked = false,
  onChange,
  label,
  disabled = false,
  error = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const radioBorderColor = error
    ? 'border-error-400'
    : isFocused
      ? 'border-primary-500'
      : 'border-text-100';

  const hoverStyles = !disabled && !checked ? 'hover:border-primary-400' : '';

  const radioStyles = `
    relative
    w-5
    h-5
    border-2
    rounded-full
    cursor-pointer
    transition-all
    duration-200
    flex
    items-center
    justify-center
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${radioBorderColor}
    ${hoverStyles}
  `;

  return (
    <label className={`flex items-center gap-3 ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className={radioStyles}>
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-primary-500"
          initial={{ scale: 0 }}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </div>
      {label && (
        <span className={`text-sm ${disabled ? 'text-text-100' : 'text-text-400'}`}>
          {label}
        </span>
      )}
    </label>
  );
};