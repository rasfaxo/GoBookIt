import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // render children element with button classes
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400 disabled:bg-blue-400 disabled:text-white',
  secondary:
    'bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 focus:ring-blue-300 disabled:text-blue-400 disabled:border-blue-200',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 disabled:bg-red-400',
  ghost:
    'bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-300 disabled:text-blue-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-md',
  md: 'text-sm px-4 py-2 rounded-lg',
  lg: 'text-base px-5 py-2.5 rounded-lg',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  className = '',
  children,
  disabled,
  asChild = false,
  ...rest
}) => {
  const classes = clsx(
    'relative inline-flex items-center justify-center font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors whitespace-nowrap disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );
  if (asChild) {
    return (
      <span className={classes} aria-disabled={disabled || loading} {...(rest as any)}>
        {leftIcon && <span className="mr-2 inline-flex items-center" aria-hidden>{leftIcon}</span>}
        <span className={clsx('inline-flex items-center', loading && 'opacity-0')}>{children}</span>
        {rightIcon && <span className="ml-2 inline-flex items-center" aria-hidden>{rightIcon}</span>}
        {loading && (
          <span className="absolute inline-flex">
            <span className="loader-circle" />
          </span>
        )}
      </span>
    );
  }
  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {leftIcon && <span className="mr-2 inline-flex items-center" aria-hidden>{leftIcon}</span>}
      <span className={clsx('inline-flex items-center', loading && 'opacity-0')}>{children}</span>
      {rightIcon && <span className="ml-2 inline-flex items-center" aria-hidden>{rightIcon}</span>}
      {loading && (
        <span className="absolute inline-flex">
          <span className="loader-circle" />
        </span>
      )}
    </button>
  );
};

export default Button;
