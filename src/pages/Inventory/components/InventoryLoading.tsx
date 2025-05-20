
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const InventoryLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Skeleton for summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Skeleton for table */}
      <div className="rounded-md border">
        <div className="p-4">
          <div className="flex items-center py-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-5 flex-1 mx-2" />
            ))}
          </div>
          <div className="space-y-3 py-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center py-2">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <Skeleton key={j} className="h-4 flex-1 mx-2" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryLoading;
