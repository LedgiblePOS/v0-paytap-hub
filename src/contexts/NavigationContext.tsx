
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavigationContextType {
  currentSection: 'superadmin' | 'merchant';
  navigateToSuperAdmin: () => void;
  navigateToMerchant: () => void;
  setCurrentSection: (section: 'superadmin' | 'merchant') => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'superadmin' | 'merchant'>('superadmin');

  const navigateToSuperAdmin = useCallback(() => {
    setCurrentSection('superadmin');
    navigate('/super-admin');
  }, [navigate]);

  const navigateToMerchant = useCallback(() => {
    setCurrentSection('merchant');
    navigate('/merchant-dashboard');
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ 
      currentSection, 
      navigateToSuperAdmin, 
      navigateToMerchant,
      setCurrentSection
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
