
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserData } from '@/types/user';

interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (user: UserData) => Promise<void>;
  user: UserData | null;
}

const DeactivateUserDialog: React.FC<DeactivateUserDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  user
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDeactivate = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onConfirm(user);
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message || 'Failed to deactivate user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const userName = user ? `${user.first_name} ${user.last_name}` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Deactivate User
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to deactivate <span className="font-semibold">{userName}</span>?
          </p>
          <p className="mt-2 text-sm text-gray-600">
            The user will no longer be able to log in to the system.
          </p>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeactivate} 
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? 'Deactivating...' : 'Deactivate User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserDialog;
