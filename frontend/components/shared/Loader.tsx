'use client';

import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Loader({ size = 'md', color }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`rounded-full border-2 border-t-transparent ${sizeClasses[size]}`}
      style={{ borderColor: color ? `${color}33` : undefined, borderTopColor: color || undefined }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background-50">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-text-400">Yükleniyor...</p>
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader size="md" />
    </div>
  );
}
