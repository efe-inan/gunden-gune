import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp } from '../animations';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  logo?: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footer,
  logo,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-[${colors.background[50]}] p-6 ${className}`}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className={`bg-[${colors.background[100]}] rounded-2xl shadow-lg p-8 border border-[${colors.background[400]}]`}>
          {logo && (
            <div className="flex justify-center mb-6">
              {logo}
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold text-[${colors.text[400]}]`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-2 text-[${colors.text[100]}]`}>
                {subtitle}
              </p>
            )}
          </div>
          {children}
          {footer && (
            <div className="mt-6 text-center">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-4 ${className}`}>
      {children}
    </form>
  );
};

interface SocialAuthProps {
  children: React.ReactNode;
  divider?: string;
  className?: string;
}

export const SocialAuth: React.FC<SocialAuthProps> = ({
  children,
  divider = 'Or continue with',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t border-[${colors.background[400]}]`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 bg-[${colors.background[100]}] text-[${colors.text[100]}]`}>
            {divider}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
};

interface SocialButtonProps {
  provider: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2.5
        bg-[${colors.background[200]}]
        border border-[${colors.background[400]}]
        rounded-lg
        text-[${colors.text[400]}]
        font-medium
        transition-all
        duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[${colors.background[300]}]'}
        ${className}
      `}
    >
      {icon}
      <span className="text-sm">{provider}</span>
    </motion.button>
  );
};