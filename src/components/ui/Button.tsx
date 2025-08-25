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
    inline-flex items-center justify-center relative overflow-hidden group
    font-medium rounded-2xl transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-teal-400/50
    disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm
    ${className}
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#4CAF9E] to-[#26A69A]
      text-white shadow-lg hover:shadow-2xl hover:-translate-y-0.5
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-teal-600 before:to-green-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-gradient-to-r from-[#FF9800] to-[#F57C00]
      text-white shadow-lg hover:shadow-2xl hover:-translate-y-0.5
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-600 before:to-amber-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    outline: `
      border border-white/20 text-white/90 bg-white/5
      hover:bg-white/10 hover:text-white
    `,
    ghost: `
      text-teal-300 hover:text-white hover:bg-white/10
    `,
    danger: `
      bg-gradient-to-r from-[#F44336] to-[#E53935]
      text-white shadow-lg hover:shadow-2xl hover:-translate-y-0.5
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-rose-600 before:to-red-600 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
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
      <span className="relative z-10 flex items-center">
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default React.memo(Button);
