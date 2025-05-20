
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

interface FACLoadedAlertProps {
  credentialsLoaded: boolean;
}

export const FACLoadedAlert: React.FC<FACLoadedAlertProps> = ({ credentialsLoaded }) => {
  if (!credentialsLoaded) return null;
  
  return (
    <Alert>
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Credentials Configured</AlertTitle>
      <AlertDescription>
        First Atlantic Commerce integration is already set up. You can update the credentials below if needed.
      </AlertDescription>
    </Alert>
  );
};
