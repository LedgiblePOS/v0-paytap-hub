
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
};

export default LoadingSpinner;
