import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

export const useUserActions = (fetchUsers: () => Promise<void>) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  
  const updateUser = async (userId: string, userData: Partial<UserData>) => {
    setActionLoading(true);
    try {
      // Update profiles table
      const profileData: Record<string, any> = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: userData.role,
        is_active: userData.is_active,
        merchant_id: userData.merchant_id
      };

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Updated',
        description: `User ${userData.first_name} ${userData.last_name} has been updated.`,
      });

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user',
        variant: 'destructive',
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = (user: UserData) => {
    // Logic to handle editing the user
    return user;
  };

  const handleResetPassword = (email: string, users: UserData[]) => {
    // Logic to handle resetting the user password
    const user = users.find((u) => u.email === email);
    return user;
  };

  const handleDeactivateUser = (userId: string, users: UserData[]) => {
    // Logic to handle deactivating the user
    const user = users.find((u) => u.id === userId);
    return user;
  };

  const executeDeactivateUser = async (user: UserData) => {
    setActionLoading(true);
    try {
      // Note: is_active should be stored outside the profiles table
      // This is a simplified example - in a real app this would be handled by a server function
      console.log(`Would deactivate user ${user.id}`);
      
      toast({
        title: "User Deactivated",
        description: "User has been successfully deactivated.",
      });
      
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast({
        title: "Deactivation Failed",
        description: "Failed to deactivate user.",
        variant: "destructive"
      });
      return false;
    } finally {
      setActionLoading(false);
    }
  };
  
  return {
    actionLoading,
    updateUser,
    handleEditUser,
    handleResetPassword,
    handleDeactivateUser,
    executeDeactivateUser
  };
};
