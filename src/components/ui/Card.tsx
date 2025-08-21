import React from 'react';
// import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  className = '',
  onClick,
  hoverable = false,
  gradient = false,
}) => {
  const baseStyles = `
    bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700
    transition-all duration-200
    ${hoverable ? 'hover:shadow-lg hover:transform hover:scale-105 cursor-pointer' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' : ''}
    ${className}
  `;

  return (
    <div className={baseStyles} onClick={onClick}>
      {(title || icon) && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4CAF9E] to-[#26A69A] flex items-center justify-center">
                  {icon}
                </div>
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;