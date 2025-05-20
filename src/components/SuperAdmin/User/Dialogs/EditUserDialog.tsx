
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/enums';
import { toast } from 'react-toastify';

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentRole: UserRole;
  onRoleChanged: (userId: string, newRole: UserRole) => Promise<boolean>;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  isOpen,
  onClose,
  userId,
  currentRole,
  onRoleChanged
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selectedRole === currentRole) {
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onRoleChanged(userId, selectedRole);
      if (success) {
        toast.success('User role updated successfully');
        onClose();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error updating user role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Select Role:</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as UserRole)}
              disabled={isSubmitting}
            >
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
