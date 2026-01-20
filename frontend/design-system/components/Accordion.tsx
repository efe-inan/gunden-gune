import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { accordionContent } from '../animations';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  icon,
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const onToggle = isControlled ? controlledOnToggle : () => setInternalIsOpen(!internalIsOpen);

  return (
    <div className={`border-b border-background-400 ${className}`}>
      <button
        onClick={() => onToggle?.()}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background-200 transition-colors duration-200"
      >
        <span className="flex items-center gap-3 font-medium text-text-400">
          {icon && <span className="text-primary-500">{icon}</span>}
          {title}
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
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={accordionContent}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="px-4 pb-3 text-text-300">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpen?: number[];
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  children,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set(defaultOpen));

  const handleToggle = (index: number) => {
    setOpenItems((prev) => {
      const newOpen = new Set(prev);
      if (allowMultiple) {
        if (newOpen.has(index)) {
          newOpen.delete(index);
        } else {
          newOpen.add(index);
        }
      } else {
        if (newOpen.has(index)) {
          newOpen.clear();
        } else {
          newOpen.clear();
          newOpen.add(index);
        }
      }
      return newOpen;
    });
  };

  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement<AccordionItemProps>(child)) {
      const isOpen = openItems.has(index);
      return React.cloneElement(child, {
        isOpen,
        onToggle: () => handleToggle(index),
      });
    }
    return child;
  });

  return (
    <div className={`rounded-lg border border-background-400 bg-background-100 overflow-hidden ${className}`}>
      {enhancedChildren}
    </div>
  );
};