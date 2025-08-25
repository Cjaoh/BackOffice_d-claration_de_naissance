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
    backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/10
    transition-all duration-300
    ${hoverable ? 'hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer' : ''}
    ${gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : ''}
    ${className}
  `;

  return (
    <div className={baseStyles} onClick={onClick}>
      {(title || icon) && (
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4CAF9E] to-[#26A69A] flex items-center justify-center shadow-lg">
                  {icon}
                </div>
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6 text-white">{children}</div>
    </div>
  );
};

export default React.memo(Card);