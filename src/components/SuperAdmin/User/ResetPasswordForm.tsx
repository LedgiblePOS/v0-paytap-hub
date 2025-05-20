
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserData } from '@/utils/modelConversions/userConverters';

interface ResetPasswordFormProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<any>;
  isSubmitting: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ user, isOpen, onClose, onSubmit, isSubmitting }) => {
  const handleSubmit = async () => {
    if (user && user.email) {
      await onSubmit(user.email);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            This will send a password reset email to {user?.email}. 
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordForm;
