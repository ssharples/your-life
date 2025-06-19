
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IOSLayoutProps {
  children: ReactNode;
  className?: string;
  withSafeArea?: boolean;
}

export const IOSLayout = ({ children, className, withSafeArea = true }: IOSLayoutProps) => {
  return (
    <div 
      className={cn(
        "min-h-screen bg-gray-50",
        className
      )}
      style={{
        paddingTop: withSafeArea ? 'max(env(safe-area-inset-top), 24px)' : '24px',
        paddingBottom: withSafeArea ? 'max(env(safe-area-inset-bottom), 24px)' : '24px',
        paddingLeft: withSafeArea ? 'max(env(safe-area-inset-left), 20px)' : '20px',
        paddingRight: withSafeArea ? 'max(env(safe-area-inset-right), 20px)' : '20px',
      }}
    >
      {children}
    </div>
  );
};
