
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
  const baseClasses = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden";
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6"
  };

  const interactiveClasses = onClick ? 
    "active:scale-[0.98] transition-all duration-150 cursor-pointer hover:shadow-md" : 
    "";

  return (
    <div
      onClick={onClick}
      className={cn(
        baseClasses,
        paddingClasses[padding],
        interactiveClasses,
        "mb-5",
        className
      )}
    >
      {children}
    </div>
  );
};
