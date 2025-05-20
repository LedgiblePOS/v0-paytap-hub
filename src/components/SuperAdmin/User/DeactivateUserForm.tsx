
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserData } from '@/utils/modelConversions/userConverters';

interface DeactivateUserFormProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => Promise<any>;
  isSubmitting: boolean;
}

const DeactivateUserForm: React.FC<DeactivateUserFormProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}) => {
  const handleSubmit = async () => {
    if (user) {
      await onSubmit(user.id);
      onClose();
    }
  };

  if (!user) return null;

  const actionVerb = user.is_active ? 'deactivate' : 'activate';
  const actioningVerb = user.is_active ? 'Deactivating' : 'Activating';
  const actionVerb2 = user.is_active ? 'Deactivate' : 'Activate';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionVerb2} User</DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionVerb} {user.first_name} {user.last_name}?
            {user.is_active && ' This will prevent them from logging in.'}
            {!user.is_active && ' This will allow them to log in again.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            variant={user.is_active ? 'destructive' : 'default'}
          >
            {isSubmitting ? `${actioningVerb}...` : actionVerb2}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserForm;
