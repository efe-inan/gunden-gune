import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp } from '../animations';
import { Sidebar, Header, type NavItem } from '../components/Navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  headerTitle?: string;
  headerSubtitle?: string;
  headerActions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  logo?: React.ReactNode;
  collapsible?: boolean;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems,
  activeItem,
  onItemClick,
  headerTitle,
  headerSubtitle,
  headerActions,
  user,
  logo,
  collapsible = false,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen flex bg-[${colors.background[50]}] ${className}`}>
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={onItemClick}
        collapsed={isCollapsed}
        onToggleCollapse={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        logo={logo}
        user={user}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          actions={headerActions}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  icon,
  action,
  className = '',
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-[${colors.background[100]}] rounded-xl border border-[${colors.background[400]}] overflow-hidden ${className}`}
    >
      {(title || icon || action) && (
        <div className={`flex items-center justify-between p-5 border-b border-[${colors.background[400]}]`}>
          <div className="flex items-center gap-3">
            {icon && <div className={`p-2 rounded-lg bg-[${colors.primary[100]}]`}>{icon}</div>}
            {title && <h3 className={`text-lg font-semibold text-[${colors.text[400]}]`}>{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
};

interface DashboardGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  cols = 3,
  gap = 6,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[cols]} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

interface DashboardSectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  description,
  action,
  children,
  className = '',
}) => {
  return (
    <section className={`mb-8 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className={`text-2xl font-bold text-[${colors.text[400]}]`}>{title}</h2>
          {description && (
            <p className={`text-[${colors.text[100]}] mt-1`}>{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className={`w-4 h-4 mx-2 text-[${colors.text[100]}]`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <a
              href={item.href}
              className={`text-[${colors.text[100]}] hover:text-[${colors.primary[500]}] transition-colors`}
            >
              {item.label}
            </a>
          ) : (
            <span className={`text-[${colors.text[300]}]`}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};