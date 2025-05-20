
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '@/utils/ErrorBoundary'; // Fixed casing

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  title?: string; // Added title property
  isLoading?: boolean; // Added for ModulePlaceholder compatibility
  contentType?: string; // Added for ModulePlaceholder compatibility
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className, title }) => {
  return (
    <ErrorBoundary>
      <div className={cn("container mx-auto p-4", className)}>
        {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default PageContainer;
