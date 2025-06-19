
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
  const baseClasses = "font-medium rounded-2xl active:scale-95 transition-all duration-150 touch-target flex items-center justify-center w-full sm:w-auto shadow-lg hover:shadow-xl";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 shadow-blue-200 hover:shadow-blue-300",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 shadow-gray-200 hover:shadow-gray-300",
    destructive: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 shadow-red-200 hover:shadow-red-300"
  };

  const sizeClasses = {
    sm: "py-3 px-5 text-sm min-h-[44px]",
    md: "py-4 px-6 text-base min-h-[48px]",
    lg: "py-5 px-8 text-lg min-h-[52px]"
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
        disabled && "cursor-not-allowed opacity-50 shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
};
