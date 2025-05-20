
import React from 'react';
import { Outlet } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1>Settings</h1>
      <Outlet />
    </div>
  );
};

export default SettingsPage;
