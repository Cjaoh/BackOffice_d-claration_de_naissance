import React from 'react';
// import { theme } from '../../styles/theme';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value = '',
  type = 'text',
  error,
  disabled = false,
  required = false,
  icon,
  onChange,
  onBlur,
  onFocus,
  className = '',
  ...restProps
}) => {
  const baseStyles = `
    w-full px-4 py-4 rounded-2xl border transition-all duration-300
    focus:outline-none focus:ring-2
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-white/10 text-white placeholder-gray-300 border-white/10 backdrop-blur-sm
    ${error 
      ? 'focus:ring-red-500 focus:border-red-500' 
      : 'focus:ring-teal-400/50 focus:border-teal-400/50'
    }
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-300">{icon}</div>
          </div>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`
            ${baseStyles}
            ${icon ? 'pl-10' : ''}
          `}
          {...restProps}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(Input);