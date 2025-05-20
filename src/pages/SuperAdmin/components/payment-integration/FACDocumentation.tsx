
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const FACDocumentation: React.FC = () => {
  return (
    <CardContent className="space-y-4">
      <Alert variant="default">
        <Info className="h-4 w-4" />
        <AlertTitle>Implementation Notes</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4 space-y-1 mt-2">
            <li>The default subscription plan (Starter) is free and does not require payment.</li>
            <li>Professional and Enterprise plans require payment via First Atlantic Commerce.</li>
            <li>When a merchant upgrades from Starter to a paid plan, they will be prompted to enter payment details.</li>
            <li>All payment processing is handled securely via the FAC API.</li>
          </ul>
        </AlertDescription>
      </Alert>
    </CardContent>
  );
};
