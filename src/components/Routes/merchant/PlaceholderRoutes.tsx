
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';
import DebugRouteWrapper from './DebugRouteWrapper';

interface PlaceholderRouteProps {
  children?: React.ReactNode;
  title?: string;
}

const PlaceholderRoute: React.FC<PlaceholderRouteProps> = ({ 
  children, 
  title = "Coming Soon" 
}) => {
  return (
    <DebugRouteWrapper>
      <Card className="border-dashed border-muted">
        <CardHeader>
          <CardTitle className="flex items-center text-muted-foreground">
            <Compass className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {children || (
            <p className="text-muted-foreground">
              This feature is under development and will be available soon.
            </p>
          )}
        </CardContent>
      </Card>
    </DebugRouteWrapper>
  );
};

export default PlaceholderRoute;
