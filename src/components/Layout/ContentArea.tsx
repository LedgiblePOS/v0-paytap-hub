
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/utils/ErrorBoundary';

interface ContentAreaProps {
  children: ReactNode;
  className?: string;
}

const ContentArea: React.FC<ContentAreaProps> = ({ children, className }) => {
  return (
    <ErrorBoundary>
      <main className={cn("flex-1 overflow-y-auto p-6", className)}>
        {children}
      </main>
    </ErrorBoundary>
  );
};

export default ContentArea;
