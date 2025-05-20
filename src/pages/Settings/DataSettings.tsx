
import React from 'react';
import SettingsLayout from './components/SettingsLayout';
import DataExportImport from './components/DataExportImport';

const DataSettings: React.FC = () => {
  return (
    <SettingsLayout 
      title="Data Export & Import" 
      description="Export your data for backup or analysis, or import data from external sources."
    >
      <DataExportImport />
    </SettingsLayout>
  );
};

export default DataSettings;
