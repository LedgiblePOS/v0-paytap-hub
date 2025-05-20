
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
import { EditUserData } from '@/types/user';
import UserForm from '@/components/SuperAdmin/User/UserForm';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (userData: EditUserData) => Promise<void>;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onAdd
}) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<EditUserData>>({
    firstName: '',
    lastName: '',
    email: '',
    role: undefined,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.role) {
      return;
    }
    
    setLoading(true);
    try {
      await onAdd({
        ...formData,
        id: '', // ID will be assigned by the backend
      } as EditUserData);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: undefined,
        isActive: true,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account in the system. Fill out the form below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <UserForm 
            userData={formData as EditUserData} 
            onChange={setFormData} 
            isNewUser 
          />
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
