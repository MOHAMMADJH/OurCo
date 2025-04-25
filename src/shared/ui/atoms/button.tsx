import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className = '', 
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props 
}) => {
  const baseStyles = 'font-semibold inline-flex items-center justify-center rounded transition-colors focus:outline-none';
  
  const variantStyles = {
    default: 'bg-[#FF6B00] text-white hover:bg-[#FF8533]',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    link: 'bg-transparent underline-offset-4 hover:underline text-gray-900 dark:text-gray-100'
  };
  
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-9 w-9'
  };
  
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button
      className={classes}
      {...props}
    />
  );
};

export default Button;
