import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: number;
  children?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  logo?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeItem,
  onItemClick,
  collapsed = false,
  onToggleCollapse,
  logo,
  user,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <aside
      className={`
        flex flex-col
        bg-background-100
        border-r border-background-400
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
    >
      <div className="p-4 border-b border-background-400">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {logo}
            </motion.div>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg hover:bg-background-300 transition-colors"
            >
              <svg
                className="w-5 h-5 text-text-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {collapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onItemClick?.(item.id);
                  if (item.children) toggleExpand(item.id);
                }}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-3
                  py-2
                  rounded-lg
                  transition-colors
                  duration-200
                  ${activeItem === item.id
                    ? 'bg-primary-100 text-primary-500'
                    : 'text-text-300 hover:bg-background-300'
                  }
                `}
              >
                {item.icon && (
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex-1 text-left text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !collapsed && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-500 text-white">
                    {item.badge}
                  </span>
                )}
                {item.children && !collapsed && (
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: expandedItems.has(item.id) ? 90 : 0 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                )}
              </button>
              {item.children && expandedItems.has(item.id) && !collapsed && (
                <AnimatePresence>
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => onItemClick?.(child.id)}
                          className={`
                            w-full
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2
                            rounded-lg
                            text-sm
                            transition-colors
                            duration-200
                            ${activeItem === child.id
                              ? 'bg-primary-100 text-primary-500'
                              : 'text-text-300 hover:bg-background-300'
                            }
                          `}
                        >
                          {child.icon && <span className="flex-shrink-0">{child.icon}</span>}
                          <span className="flex-1 text-left">{child.label}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </AnimatePresence>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-background-400">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <p className="text-sm font-medium text-text-400 truncate">
                    {user.name}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </aside>
  );
};

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
  user,
  className = '',
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={`
        flex items-center justify-between
        bg-background-100
        border-b border-background-400
        px-6 py-4
        ${className}
      `}
    >
      <div>
        {title && (
          <h1 className="text-2xl font-bold text-text-400">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-text-100 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <Avatar name={user.name} src={user.avatar} size="sm" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};