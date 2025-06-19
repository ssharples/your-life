
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
  const baseClasses = "bg-white rounded-2xl shadow-lg border border-gray-100 mb-4";
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6"
  };

  const interactiveClasses = onClick ? "active:scale-[0.98] transition-transform duration-150 cursor-pointer hover:shadow-xl" : "hover:shadow-xl transition-shadow duration-150";

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
