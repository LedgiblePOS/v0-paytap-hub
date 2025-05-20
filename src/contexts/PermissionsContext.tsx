
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Permission = string;

interface PermissionsContextType {
  permissions: Permission[];
  hasPermission: (permission: Permission | Permission[]) => boolean;
  setPermissions: (permissions: Permission[]) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const hasPermission = (permission: Permission | Permission[]) => {
    if (Array.isArray(permission)) {
      return permission.some(p => permissions.includes(p));
    }
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission, setPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
