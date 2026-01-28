import { Variants } from 'framer-motion';

export const animations = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easings: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.42, 0, 1, 1],
    easeOut: [0, 0, 0.58, 1],
    easeInOut: [0.42, 0, 0.58, 1],
    spring: [0.175, 0.885, 0.32, 1.275],
  },
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: animations.durations.normal / 1000 }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: animations.durations.normal / 1000, ease: animations.easings.easeOut }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: animations.durations.normal / 1000, ease: animations.easings.easeOut }
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: animations.durations.normal / 1000, ease: animations.easings.easeOut }
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: animations.durations.normal / 1000, ease: animations.easings.easeOut }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: animations.durations.normal / 1000, ease: animations.easings.spring }
  },
};

export const slideUp: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { duration: animations.durations.slow / 1000, ease: animations.easings.easeOut }
  },
};

export const slideDown: Variants = {
  hidden: { y: '-100%' },
  visible: {
    y: 0,
    transition: { duration: animations.durations.slow / 1000, ease: animations.easings.easeOut }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
};

export const pressScale: Variants = {
  initial: { scale: 1 },
  press: { scale: 0.98 },
};

export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const rotate: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const bounce: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

export const shake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: animations.easings.easeOut }
  },
};

export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.3, ease: animations.easings.easeOut }
  },
};

export const accordionContent: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: animations.easings.easeOut,
    },
  },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: animations.easings.easeOut }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { duration: 0.2, ease: animations.easings.easeIn }
  },
};

export const tabIndicator: any = {
  initial: { x: 0, width: 0 },
  animate: (position: number, width: number) => ({
    x: position,
    width: width,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  }),
};

export const progressFill: any = {
  initial: { width: 0 },
  animate: (percentage: number) => ({
    width: `${percentage}%`,
    transition: { duration: 0.8, ease: animations.easings.easeOut },
  }),
};

export type AnimationType = keyof typeof animations;