'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { colors } from '@/design-system/colors';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success-50',
    iconColor: 'text-success-500',
    borderColor: 'border-success-200',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-error-50',
    iconColor: 'text-error-500',
    borderColor: 'border-error-200',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-warning-50',
    iconColor: 'text-warning-500',
    borderColor: 'border-warning-200',
  },
  info: {
    icon: Info,
    bgColor: 'bg-background-50',
    iconColor: 'text-primary-500',
    borderColor: 'border-background-200',
  },
};

function ToastItem({ id, type, message, duration = 5000, onClose }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg p-4 mb-2 flex items-center gap-3 min-w-[300px]`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
      <p className="flex-1 text-text-700 text-sm">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 hover:bg-black/5 rounded transition-colors"
      >
        <X className="w-4 h-4 text-text-400" />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

let toastId = 0;
const listeners = new Set<(toasts: any[]) => void>();
let toasts: any[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const id = `toast-${++toastId}`;
    toasts.push({ id, type, message });
    notifyListeners();
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  warning: (message: string) => toast.show(message, 'warning'),
  info: (message: string) => toast.show(message, 'info'),
  close: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    notifyListeners();
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [localToasts, setLocalToasts] = useState<any[]>([]);

  useEffect(() => {
    listeners.add(setLocalToasts);
    setLocalToasts([...toasts]);
    return () => { listeners.delete(setLocalToasts); };
  }, []);

  return (
    <>
      {children}
      <ToastContainer toasts={localToasts} onClose={toast.close} />
    </>
  );
}
