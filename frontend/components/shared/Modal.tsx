'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '@/design-system/colors';
import { modalOverlay, modalContent } from '@/design-system/animations';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, children, title, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={`bg-white rounded-xl shadow-2xl ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
              variants={modalContent}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-background-200">
                  <h2 className="text-xl font-semibold text-text-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-background-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-text-400" />
                  </button>
                </div>
              )}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
