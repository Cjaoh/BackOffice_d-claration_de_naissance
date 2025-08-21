import React from 'react';

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
      bg-gradient-to-r from-[#4CAF9E] to-[#26A69A]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[#4CAF9E]
    `,
    secondary: `
      bg-gradient-to-r from-[#FF9800] to-[#FF9800]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[#FF9800]
    `,
    outline: `
      border-2 border-[#4CAF9E] text-[#4CAF9E] dark:text-[#4CAF9E]
      hover:bg-[#4CAF9E] hover:text-white
      focus:ring-[#4CAF9E]
      dark:border-[#4CAF9E] dark:hover:bg-[#4CAF9E] dark:hover:text-white
    `,
    ghost: `
      text-[#4CAF9E] hover:bg-[#4CAF9E] hover:bg-opacity-10
      focus:ring-[#4CAF9E]
      dark:text-[#4CAF9E]
    `,
    danger: `
      bg-gradient-to-r from-[#F44336] to-[#F44336]
      text-white hover:shadow-lg transform hover:scale-105
      focus:ring-[#F44336]
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
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
