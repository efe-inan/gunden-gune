import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale } from '../animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  variant = 'default',
  padding = 'md',
}) => {
  const baseStyles = `
    rounded-xl
    transition-all duration-300
    ${clickable ? 'cursor-pointer' : ''}
  `;

  const variants = {
    default: `
      bg-background-100
      border border-background-400
    `,
    outlined: `
      bg-transparent
      border-2 border-background-400
    `,
    elevated: `
      bg-background-100
      border border-background-400
      shadow-md
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const CardComponent = motion.div;

  return (
    <CardComponent
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      variants={hover ? hoverScale : undefined}
      whileHover={hover ? 'hover' : undefined}
      onClick={onClick}
    >
      {children}
    </CardComponent>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold text-text-400 ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-text-100 mt-1 ${className}`}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end gap-2 mt-4 pt-4 border-t border-background-400 ${className}`}>
      {children}
    </div>
  );
};