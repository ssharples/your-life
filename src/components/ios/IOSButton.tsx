
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IOSButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export const IOSButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className,
  disabled = false,
  type = 'button'
}: IOSButtonProps) => {
  const baseClasses = "font-medium rounded-xl active:scale-95 transition-all duration-150 touch-target flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white shadow-sm hover:bg-blue-600 disabled:bg-gray-300",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
    destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600 disabled:bg-gray-300"
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
};
