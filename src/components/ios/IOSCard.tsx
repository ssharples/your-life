
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
  const baseClasses = "bg-white rounded-2xl shadow-sm border border-gray-100";
  
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6"
  };

  const interactiveClasses = onClick ? "active:scale-[0.98] transition-transform duration-150 cursor-pointer" : "";

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
