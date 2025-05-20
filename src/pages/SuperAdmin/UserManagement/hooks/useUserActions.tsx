
import { useState, useCallback } from 'react';
import { EditUserData, UserData } from '@/components/SuperAdmin/User/utils/userDataConverter';
import { toast } from '@/components/ui/use-toast';

export function useUserActions(refetchUsers: () => void) {
  const [actionLoading, setActionLoading] = useState(false);

  const handleEditUser = useCallback((userData: EditUserData) => {
    // This would typically do some processing before opening the dialog
    console.log('Processing user for editing:', userData);
    return userData;
  }, []);

  const handleResetPassword = useCallback((email: string, users: UserData[]) => {
    const user = users.find(u => u.email === email);
    if (user) {
      // Convert to EditUserData format
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        merchant_id: user.merchant_id,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    }
    return null;
  }, []);

  const handleDeactivateUser = useCallback((userId: string, users: UserData[]) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Convert to EditUserData format
      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
        merchant_id: user.merchant_id,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
    }
    return null;
  }, []);

  const executeDeactivateUser = useCallback(async (user: EditUserData) => {
    setActionLoading(true);
    try {
      // This would call an API endpoint
      console.log('Deactivating user:', user);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "User deactivated",
        description: `${user.first_name} ${user.last_name} has been deactivated.`,
      });
      
      refetchUsers();
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate user. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [refetchUsers]);

  return {
    actionLoading,
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser,
    executeDeactivateUser
  };
}
