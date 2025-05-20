
import React from 'react';
import SettingsLayout from './components/SettingsLayout';
import ThemeCustomization from './components/ThemeCustomization';

const AppearanceSettings: React.FC = () => {
  return (
    <SettingsLayout 
      title="Appearance Settings" 
      description="Customize the look and feel of your dashboard."
    >
      <ThemeCustomization />
    </SettingsLayout>
  );
};

export default AppearanceSettings;
