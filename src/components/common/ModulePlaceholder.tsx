
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import PageContainer from './PageContainer';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Generic placeholder component for modules that are still in development
 * Ensures content is always visible to prevent white page issues
 */
const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  title,
  description,
  icon = <AlertCircle className="h-10 w-10" />,
  isLoading = false
}) => {
  // Enhanced logging for component lifecycle
  useEffect(() => {
    console.log(`[ModulePlaceholder] Mounting: ${title}`);
    
    return () => {
      console.log(`[ModulePlaceholder] Unmounting: ${title}`);
    };
  }, [title]);

  return (
    <PageContainer 
      title={title} 
      isLoading={isLoading}
      contentType={`${title.toLowerCase().replace(/\s+/g, '-')}-placeholder`}
    >
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              {icon}
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>
              This module is currently in development and will be available in an upcoming release.
              Thank you for your patience.
            </p>
            <p className="text-sm text-muted-foreground">
              For assistance or questions, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default ModulePlaceholder;
