import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { hoverScale, pressScale } from '../animations';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  motion?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  motion: useMotion = true,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary-500
      text-white
      hover:bg-primary-600
      focus:ring-primary-500
      shadow-[0_2px_4px_rgba(0,0,0,0.1)]
      hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]
    `,
    secondary: `
      bg-secondary-100
      text-text-400
      hover:bg-secondary-200
      focus:ring-secondary-300
    `,
    outline: `
      bg-transparent
      border-2 border-primary-500
      text-primary-500
      hover:bg-primary-50
      focus:ring-primary-500
    `,
    ghost: `
      bg-transparent
      text-text-400
      hover:bg-background-200
      focus:ring-text-400
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const motionVariants = useMotion ? { ...hoverScale, ...pressScale } : undefined;

  const ButtonComponent = useMotion ? motion.button : 'button';

  return (
    <ButtonComponent
      className={buttonStyles}
      disabled={disabled || loading}
      variants={motionVariants as any}
      whileHover={useMotion ? 'hover' : undefined}
      whileTap={useMotion ? 'press' : undefined}
      {...(props as any)}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </ButtonComponent>
  );
};