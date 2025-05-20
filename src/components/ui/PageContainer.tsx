
import React from 'react';

interface PageContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
