
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AppRoutes from '@/components/Routes/AppRoutes';
import ErrorBoundary from '@/utils/ErrorBoundary'; 
import WhiteScreenRecovery from '@/components/common/WhiteScreenRecovery';
import BlankPageDetector from '@/components/BlankPageDetector';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  // Add console log to verify component rendering and provider wrapping
  console.log('[App] Rendering App component with AuthProvider');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <WhiteScreenRecovery />
            <BlankPageDetector />
            <AppRoutes />
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
