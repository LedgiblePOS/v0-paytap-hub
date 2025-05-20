
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: number;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 24, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <Loader2 className="animate-spin" size={size} />
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default Loading;
