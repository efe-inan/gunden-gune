import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp, slideInRight } from '../animations';
import { ProgressBar } from '../components/Progress';

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
  isValid?: boolean;
}

interface OnboardingLayoutProps {
  steps: Step[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  allowSkip?: boolean;
  className?: string;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onComplete,
  allowSkip = false,
  className = '',
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      onNext();
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      onNext();
    } else {
      onComplete();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`min-h-screen bg-[${colors.background[50]}] flex items-center justify-center p-6 ${className}`}>
      <div className="w-full max-w-4xl">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <ProgressBar value={progress} size="lg" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`text-xs ${
                  index <= currentStep
                    ? `text-[${colors.primary[500]}]`
                    : `text-[${colors.text[100]}]`
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </motion.div>

        <div className={`bg-[${colors.background[100]}] rounded-2xl shadow-lg p-8 border border-[${colors.background[400]}]`}>
          <motion.div
            key={currentStep}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="min-h-[400px]"
          >
            {steps[currentStep].content}
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex justify-between items-center"
          >
            <button
              onClick={onPrevious}
              disabled={currentStep === 0}
              className={`
                px-6 py-2.5
                text-[${colors.text[400]}]
                font-medium
                transition-all
                duration-200
                ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[${colors.background[300]}] rounded-lg'}
              `}
            >
              Previous
            </button>

            <div className="flex gap-3">
              {allowSkip && currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className={`px-6 py-2.5 text-[${colors.text[100]}] hover:text-[${colors.text[400]}] transition-colors duration-200`}
                >
                  Skip
                </button>
              )}
              <motion.button
                onClick={handleNext}
                disabled={!steps[currentStep].isValid && !allowSkip}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-6 py-2.5
                  bg-[${colors.primary[500]}]
                  text-white
                  font-medium
                  rounded-lg
                  transition-all
                  duration-200
                  ${!steps[currentStep].isValid && !allowSkip ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[${colors.primary[600]}]'}
                `}
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(index);
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || index <= currentStep);

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                relative
                w-10 h-10
                rounded-full
                flex items-center justify-center
                font-medium
                transition-all
                duration-200
                ${
                  isCompleted
                    ? `bg-[${colors.success[400]}] text-white`
                    : isCurrent
                    ? `bg-[${colors.primary[500]}] text-white`
                    : `bg-[${colors.background[400]}] text-[${colors.text[100]}]`
                }
                ${isClickable && !isCurrent ? 'hover:bg-[${colors.primary[400]}]' : ''}
                ${!isClickable ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </button>

            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${isCompleted ? `bg-[${colors.success[400]}]` : `bg-[${colors.background[400]}]`} mx-2`} />
            )}

            <span
              className={`
                absolute left-12
                text-sm font-medium whitespace-nowrap
                ${isCurrent ? `text-[${colors.primary[500]}]` : isCompleted ? `text-[${colors.success[400]}]` : `text-[${colors.text[100]}]`}
              `}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};