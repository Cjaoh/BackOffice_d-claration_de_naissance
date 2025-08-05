import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[${theme.colors.primary}] to-[${theme.colors.primaryDark}]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[${theme.colors.primary}]
    `,
    secondary: `
      bg-gradient-to-r from-[${theme.colors.secondary}] to-[${theme.colors.warning}]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[${theme.colors.secondary}]
    `,
    outline: `
      border-2 border-[${theme.colors.primary}] text-[${theme.colors.primary}]
      hover:bg-[${theme.colors.primary}] hover:text-white
      focus:ring-[${theme.colors.primary}]
    `,
    ghost: `
      text-[${theme.colors.primary}] hover:bg-[${theme.colors.primary}] hover:bg-opacity-10
      focus:ring-[${theme.colors.primary}]
    `,
    danger: `
      bg-gradient-to-r from-[${theme.colors.error}] to-[${theme.colors.error}]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[${theme.colors.error}]
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 