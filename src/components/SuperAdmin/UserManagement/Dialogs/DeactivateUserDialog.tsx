
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeactivateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  onDeactivate: () => void;
  onConfirm?: () => void; // For compatibility
  isLoading?: boolean;
}

const DeactivateUserDialog: React.FC<DeactivateUserDialogProps> = ({
  isOpen,
  onClose,
  user,
  onDeactivate,
  onConfirm,
  isLoading = false,
}) => {
  const handleDeactivate = () => {
    if (onDeactivate) {
      onDeactivate();
    } else if (onConfirm) {
      // For backward compatibility
      onConfirm();
    }
  };

  const userName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : 'this user';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate User</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate {userName}? This action can be reversed later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeactivate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deactivating...
              </>
            ) : (
              'Deactivate'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserDialog;
