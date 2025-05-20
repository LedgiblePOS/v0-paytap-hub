
import React, { useState } from 'react';
import AccountingTabs from './components/AccountingTabs';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/utils/errorBoundary';
import PageContainer from '@/components/common/PageContainer';
import NewTransactionDialog from './components/NewTransactionDialog';
import ExportImportData from './components/ExportImportData';
import { useAuth } from '@/hooks/useAuth';

const Accounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Safely access merchantId from the current user
  const merchantId = user?.id;

  const handleDataImported = () => {
    toast({
      title: "Data Imported",
      description: "Your accounting data has been imported successfully."
    });
  };
  
  const handleTransactionAdded = () => {
    toast({
      title: "Transaction Added",
      description: "Your transaction has been added successfully."
    });
  };
  
  return (
    <PageContainer title="Accounting">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Accounting</h1>
          <div className="flex gap-2">
            <ExportImportData 
              merchantId={merchantId} 
              onDataImported={handleDataImported}
            />
            <NewTransactionDialog 
              merchantId={merchantId}
              onTransactionAdded={handleTransactionAdded}
            />
          </div>
        </div>

        <ErrorBoundary>
          <AccountingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </ErrorBoundary>
      </div>
    </PageContainer>
  );
};

export default Accounting;
