import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp, staggerContainer } from '../animations';

interface LandingLayoutProps {
  hero: React.ReactNode;
  features: React.ReactNode;
  testimonials: React.ReactNode;
  cta: React.ReactNode;
  footer: React.ReactNode;
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({
  hero,
  features,
  testimonials,
  cta,
  footer,
}) => {
  return (
    <div className={`min-h-screen bg-[${colors.background[50]}]`}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <section className="min-h-screen flex items-center justify-center">
          {hero}
        </section>

        <section className={`py-20 bg-[${colors.background[100]}]`}>
          <div className="max-w-7xl mx-auto px-6">
            {features}
          </div>
        </section>

        <section className={`py-20 bg-[${colors.background[50]}]`}>
          <div className="max-w-7xl mx-auto px-6">
            {testimonials}
          </div>
        </section>

        <section className={`py-20 bg-[${colors.background[100]}]`}>
          <div className="max-w-7xl mx-auto px-6">
            {cta}
          </div>
        </section>

        <footer>{footer}</footer>
      </motion.div>
    </div>
  );
};

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCta: React.ReactNode;
  secondaryCta?: React.ReactNode;
  image?: React.ReactNode;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  image,
  className = '',
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      className={`max-w-7xl mx-auto px-6 ${className}`}
    >
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            variants={fadeInUp}
            className={`text-5xl lg:text-6xl font-bold text-[${colors.text[400]}] leading-tight`}
          >
            {title}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className={`mt-6 text-xl text-[${colors.text[300]}] leading-relaxed`}
          >
            {subtitle}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="mt-8 flex gap-4"
          >
            {primaryCta}
            {secondaryCta}
          </motion.div>
        </div>
        {image && (
          <motion.div
            variants={fadeInUp}
            className="flex justify-center"
          >
            {image}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

interface FeaturesGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  children,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-8 ${className}`}>
      {children}
    </div>
  );
};

interface TestimonialsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const TestimonialsGrid: React.FC<TestimonialsGridProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

interface CTASectionProps {
  title: string;
  description: string;
  cta: React.ReactNode;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  cta,
  className = '',
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-[${colors.primary[500]}] rounded-2xl p-12 text-center ${className}`}
    >
      <h2 className={`text-3xl font-bold text-white mb-4`}>
        {title}
      </h2>
      <p className={`text-xl text-white/90 mb-8 max-w-2xl mx-auto`}>
        {description}
      </p>
      {cta}
    </motion.div>
  );
};