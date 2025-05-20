
import React from 'react';
import SettingsLayout from './components/SettingsLayout';
import NotificationPreferences from './components/NotificationPreferences';

const NotificationSettings: React.FC = () => {
  return (
    <SettingsLayout 
      title="Notification Settings" 
      description="Configure how and when you receive notifications from the system."
    >
      <NotificationPreferences />
    </SettingsLayout>
  );
};

export default NotificationSettings;
