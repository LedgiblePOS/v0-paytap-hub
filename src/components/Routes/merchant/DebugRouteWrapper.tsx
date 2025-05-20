
import React from 'react';

export interface DebugRouteWrapperProps {
  children: React.ReactNode;
  routeName?: string;
}

/**
 * A wrapper component for debugging routes
 * Displays the route name and children in a styled box
 */
const DebugRouteWrapper: React.FC<DebugRouteWrapperProps> = ({ children, routeName }) => {
  return (
    <div className="border border-dashed border-gray-300 p-4 rounded-md">
      {routeName && (
        <div className="text-xs bg-gray-100 p-1 mb-2 rounded font-mono">
          Route: {routeName}
        </div>
      )}
      {children}
    </div>
  );
};

export default DebugRouteWrapper;
