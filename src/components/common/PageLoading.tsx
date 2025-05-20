
import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoading: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading...</span>
    </div>
  );
};

export default PageLoading;
