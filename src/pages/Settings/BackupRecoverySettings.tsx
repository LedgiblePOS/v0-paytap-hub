
import React from 'react';
import SettingsLayout from './components/SettingsLayout';
import BackupRecoveryPlans from '@/components/Settings/BackupRecovery/BackupRecoveryPlans';

const BackupRecoverySettings: React.FC = () => {
  return (
    <SettingsLayout 
      title="Backup & Recovery" 
      description="Manage backup procedures, recovery plans, and test restoration processes"
    >
      <BackupRecoveryPlans />
    </SettingsLayout>
  );
};

export default BackupRecoverySettings;
