
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
        withSafeArea && "safe-area-insets",
        className
      )}
      style={{
        paddingTop: withSafeArea ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: withSafeArea ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: withSafeArea ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: withSafeArea ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  );
};
