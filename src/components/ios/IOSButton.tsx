
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
  const baseClasses = "font-semibold rounded-3xl active:scale-[0.97] transition-all duration-200 touch-target flex items-center justify-center w-full shadow-sm border-0";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-blue-100",
    secondary: "bg-gray-50 text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 shadow-gray-100 border border-gray-200",
    destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 shadow-red-100"
  };

  const sizeClasses = {
    sm: "py-3 px-6 text-sm min-h-[48px] text-base",
    md: "py-4 px-8 text-base min-h-[52px]",
    lg: "py-5 px-10 text-lg min-h-[56px] font-medium"
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
        disabled && "cursor-not-allowed opacity-60 shadow-none transform-none",
        className
      )}
    >
      {children}
    </button>
  );
};
