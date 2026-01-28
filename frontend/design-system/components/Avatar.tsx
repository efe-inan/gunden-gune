import React from 'react';
import Image from 'next/image';
import { colors } from '../colors';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  variant = 'circle',
  status,
  className = '',
  onClick,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const variants = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const statusColors = {
    online: `bg-[${colors.success[400]}]`,
    offline: `bg-[${colors.text[100]}]`,
    busy: `bg-[${colors.error[400]}]`,
    away: `bg-[${colors.warning[400]}]`,
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarContent = src ? (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${variants[variant]}`}
      onError={(e: any) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement?.classList.add('has-error');
      }}
    />
  ) : name ? (
    <span className={`font-medium text-[${colors.text[400]}]`}>
      {getInitials(name)}
    </span>
  ) : (
    <svg
      className={`w-1/2 h-1/2 text-[${colors.text[100]}]`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        ${sizes[size]}
        ${variants[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${!src ? `bg-[${colors.primary[100]}]` : ''}
        overflow-hidden
        ${className}
      `}
      onClick={onClick}
    >
      {avatarContent}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]}
            ${statusColors[status]}
            rounded-full
            border-2
            border-[${colors.background[100]}]
          `}
        />
      )}
    </div>
  );
};

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children, max = 3, className = '' }) => {
  const avatars = React.Children.toArray(children).slice(0, max);
  const extraCount = React.Children.count(children) - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {avatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-[${colors.background[100]}] rounded-full">
          {avatar}
        </div>
      ))}
      {extraCount > 0 && (
        <Avatar
          name={`+${extraCount}`}
          size="md"
          className={`bg-[${colors.background[300]}] text-[${colors.text[300]}]`}
        />
      )}
    </div>
  );
};