
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IOSCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const IOSCard = ({ 
  children, 
  className, 
  padding = 'md',
  onClick 
}: IOSCardProps) => {
  const baseClasses = "bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 overflow-hidden";
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const interactiveClasses = onClick ? 
    "active:scale-[0.98] transition-all duration-200 cursor-pointer hover:shadow-md active:shadow-sm" : 
    "transition-shadow duration-200";

  return (
    <div
      onClick={onClick}
      className={cn(
        baseClasses,
        paddingClasses[padding],
        interactiveClasses,
        className
      )}
    >
      {children}
    </div>
  );
};
