import React from 'react';
import { motion } from 'framer-motion';
import { colors } from '../colors';
import { fadeInUp } from '../animations';
import { Sidebar, Header, type NavItem } from '../components/Navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarItems: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  headerTitle?: string;
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  logo?: React.ReactNode;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  sidebarItems,
  activeItem,
  onItemClick,
  headerTitle,
  user,
  logo,
  className = '',
}) => {
  return (
    <div className={`min-h-screen flex bg-[${colors.background[50]}] ${className}`}>
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={onItemClick}
        logo={logo}
        user={user}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={headerTitle}
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

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  trend = 'neutral',
  className = '',
}) => {
  const colorClasses = {
    primary: `bg-[${colors.primary[100]}] text-[${colors.primary[500]}]`,
    success: `bg-[${colors.success[100]}] text-[${colors.success[400]}]`,
    warning: `bg-[${colors.warning[100]}] text-[${colors.warning[400]}]`,
    error: `bg-[${colors.error[100]}] text-[${colors.error[400]}]`,
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: null,
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-[${colors.background[100]}] rounded-xl border border-[${colors.background[400]}] p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-sm font-medium text-[${colors.text[100]}] mb-1`}>
            {title}
          </p>
          <h3 className={`text-2xl font-bold text-[${colors.text[400]}]`}>
            {value}
          </h3>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>

      {change && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 ${
            change.type === 'increase'
              ? `text-[${colors.success[400]}]`
              : `text-[${colors.error[400]}]`
          }`}>
            {trendIcons[trend]}
            <span className="text-sm font-medium">
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
          </div>
          <span className={`text-xs text-[${colors.text[100]}]`}>
            {change.label || 'from last month'}
          </span>
        </div>
      )}
    </motion.div>
  );
};

interface AdminTableProps {
  columns: {
    key: string;
    label: string;
    sortable?: boolean;
    width?: string;
  }[];
  data: any[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
}

export const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  className = '',
}) => {
  return (
    <div className={`bg-[${colors.background[100]}] rounded-xl border border-[${colors.background[400]}] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b border-[${colors.background[400]}]`}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={column.sortable ? () => onSort?.(column.key) : undefined}
                  className={`
                    px-6 py-4 text-left text-xs font-medium uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-[${colors.background[200]}]' : ''}
                    text-[${colors.text[100]}]
                  `}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          sortDirection === 'asc' ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`border-b border-[${colors.background[400]}] hover:bg-[${colors.background[200]}] transition-colors`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-[${colors.text[300]}]`}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface AdminToolbarProps {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({
  search,
  filters,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 ${className}`}>
      {search && (
        <div className="flex-1">
          {search}
        </div>
      )}
      {filters && (
        <div className="flex items-center gap-3">
          {filters}
        </div>
      )}
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

interface AdminQuickStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const AdminQuickStat: React.FC<AdminQuickStatProps> = ({
  label,
  value,
  icon,
  onClick,
  className = '',
}) => {
  return (
    <motion.div
      variants={fadeInUp}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      className={`
        bg-[${colors.background[100]}]
        rounded-xl
        border border-[${colors.background[400]}]
        p-4
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`p-2 rounded-lg bg-[${colors.primary[100]}]`}>
            {icon}
          </div>
        )}
        <div>
          <p className={`text-xs text-[${colors.text[100]}] uppercase tracking-wider`}>
            {label}
          </p>
          <p className={`text-2xl font-bold text-[${colors.text[400]}]`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};