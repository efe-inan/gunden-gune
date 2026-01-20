import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'underline' | 'pills' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'underline',
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };

  const variants = {
    underline: `
      relative
      flex
      gap-1
      border-b
      border-background-400
    `,
    pills: `
      flex
      gap-2
      bg-background-300
      p-1
      rounded-lg
      inline-flex
    `,
    segmented: `
      flex
      gap-0
      bg-background-300
      p-1
      rounded-lg
      overflow-hidden
    `,
  };

  const tabVariants = {
    underline: `
      relative
      px-4
      py-2
      text-text-100
      hover:text-text-400
      transition-colors
      ${sizes[size]}
      font-medium
    `,
    pills: `
      px-4
      py-2
      rounded-md
      transition-all
      ${sizes[size]}
      font-medium
    `,
    segmented: `
      flex-1
      text-center
      px-4
      py-2
      transition-all
      ${sizes[size]}
      font-medium
      first:rounded-l-md
      last:rounded-r-md
    `,
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={variants[variant]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={`
                ${tabVariants[variant]}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive ? getActiveStyles(variant) : getInactiveStyles(variant)}
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const getActiveStyles = (variant: string) => {
  switch (variant) {
    case 'underline':
      return `
        text-primary-500
        after:content-['']
        after:absolute
        after:bottom-0
        after:left-0
        after:w-full
        after:h-0.5
        after:bg-primary-500
      `;
    case 'pills':
      return `
        bg-background-100
        text-primary-500
        shadow-sm
      `;
    case 'segmented':
      return `
        bg-background-100
        text-primary-500
      `;
    default:
      return '';
  }
};

const getInactiveStyles = (variant: string) => {
  switch (variant) {
    case 'underline':
      return 'text-text-100 hover:text-text-400';
    case 'pills':
      return 'text-text-300 hover:text-text-400';
    case 'segmented':
      return 'text-text-300 hover:text-text-400';
    default:
      return '';
  }
};

interface TabPanelProps {
  value: string;
  activeTab: string;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({ value, activeTab, children }) => {
  if (value !== activeTab) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};