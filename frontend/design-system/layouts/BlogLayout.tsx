import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { colors } from '../colors';
import { fadeInUp, staggerContainer } from '../animations';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Avatar } from '../components/Avatar';

interface BlogListingLayoutProps {
  featured?: React.ReactNode;
  posts: React.ReactNode;
  sidebar?: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export const BlogListingLayout: React.FC<BlogListingLayoutProps> = ({
  featured,
  posts,
  sidebar,
  pagination,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-[${colors.background[50]}] ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {featured && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-12"
          >
            {featured}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {posts}
            </motion.div>

            {pagination && (
              <motion.div
                variants={fadeInUp}
                className="mt-12"
              >
                {pagination}
              </motion.div>
            )}
          </div>

          {sidebar && (
            <div className="lg:col-span-1">
              <motion.div
                variants={fadeInUp}
                className={`sticky top-8`}
              >
                {sidebar}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface BlogCardProps {
  image?: string;
  category: string;
  title: string;
  excerpt: string;
  author?: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  href?: string;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
  href,
  variant = 'default',
  className = '',
}) => {
  const CardWrapper = href ? 'a' : 'div';
  const cardProps = href ? { href } : {};

  if (variant === 'featured') {
    return (
      <motion.div
        variants={fadeInUp}
        className={`relative bg-[${colors.background[100]}] rounded-2xl overflow-hidden border border-[${colors.background[400]}] ${className}`}
      >
        {image && (
          <div className="aspect-video w-full overflow-hidden relative">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className="p-8">
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-[${colors.primary[100]}] text-[${colors.primary[500]}] mb-4`}>
            {category}
          </span>
          <h3 className={`text-3xl font-bold text-[${colors.text[400]}] mb-4 hover:text-[${colors.primary[500]}] transition-colors`}>
            {title}
          </h3>
          <p className={`text-[${colors.text[300]}] mb-6 text-lg`}>
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            {author && (
              <div className="flex items-center gap-3">
                <Avatar name={author.name} src={author.avatar} size="sm" />
                <span className={`text-sm text-[${colors.text[400]}]`}>
                  {author.name}
                </span>
              </div>
            )}
            <div className={`flex items-center gap-4 text-sm text-[${colors.text[100]}]`}>
              <span>{date}</span>
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <CardWrapper {...cardProps}>
      <motion.div
        variants={fadeInUp}
        className={`bg-[${colors.background[100]}] rounded-xl overflow-hidden border border-[${colors.background[400]}] ${className}`}
      >
        {image && (
          <div className={`aspect-video w-full overflow-hidden relative ${variant === 'compact' ? 'hidden' : ''}`}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className={`p-6 ${variant === 'compact' ? 'py-4' : ''}`}>
          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-[${colors.primary[100]}] text-[${colors.primary[500]}] mb-3`}>
            {category}
          </span>
          <h3 className={`text-xl font-bold text-[${colors.text[400]}] mb-2 hover:text-[${colors.primary[500]}] transition-colors`}>
            {title}
          </h3>
          <p className={`text-[${colors.text[300]}] mb-4 line-clamp-3 ${variant === 'compact' ? 'hidden' : ''}`}>
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-sm">
            {author && variant !== 'compact' && (
              <div className="flex items-center gap-2">
                <Avatar name={author.name} src={author.avatar} size="xs" />
                <span className={`text-[${colors.text[400]}]`}>
                  {author.name}
                </span>
              </div>
            )}
            <div className={`flex items-center gap-3 text-[${colors.text[100]}]`}>
              <span>{date}</span>
              {readTime && <span>• {readTime}</span>}
            </div>
          </div>
        </div>
      </motion.div>
    </CardWrapper>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        whileHover={currentPage > 1 ? { scale: 1.05 } : undefined}
        whileTap={currentPage > 1 ? { scale: 0.95 } : undefined}
        className={`px-3 py-2 rounded-lg ${currentPage === 1
          ? `text-[${colors.text[100]}] cursor-not-allowed`
          : `text-[${colors.text[400]}] hover:bg-[${colors.background[300]}]`
          }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className={`px-3 py-2 text-[${colors.text[100]}]`}>...</span>
          ) : (
            <motion.button
              onClick={() => onPageChange(page as number)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium ${currentPage === page
                ? `bg-[${colors.primary[500]}] text-white`
                : `text-[${colors.text[400]}] hover:bg-[${colors.background[300]}]`
                }`}
            >
              {page}
            </motion.button>
          )}
        </React.Fragment>
      ))}

      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        whileHover={currentPage < totalPages ? { scale: 1.05 } : undefined}
        whileTap={currentPage < totalPages ? { scale: 0.95 } : undefined}
        className={`px-3 py-2 rounded-lg ${currentPage === totalPages
          ? `text-[${colors.text[100]}] cursor-not-allowed`
          : `text-[${colors.text[400]}] hover:bg-[${colors.background[300]}]`
          }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
};