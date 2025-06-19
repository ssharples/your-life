
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
        paddingTop: withSafeArea ? 'max(env(safe-area-inset-top), 0px)' : undefined,
        paddingBottom: withSafeArea ? 'max(env(safe-area-inset-bottom), 16px)' : undefined,
        paddingLeft: withSafeArea ? 'max(env(safe-area-inset-left), 16px)' : undefined,
        paddingRight: withSafeArea ? 'max(env(safe-area-inset-right), 16px)' : undefined,
      }}
    >
      <div className="px-4 py-2">
        {children}
      </div>
    </div>
  );
};
