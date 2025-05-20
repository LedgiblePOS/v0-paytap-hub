
import { UserRole } from '@/types/enums';

export interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: any) => Promise<boolean>;
  onCreateUser?: (userData: any) => Promise<any>;
  onCreate?: (userData: any) => Promise<any>;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
}

export interface EditUserFormProps {
  userData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    merchantId?: string | null;
  };
  isLoading: boolean;
  onSubmit: (values: any) => Promise<void>;
}

export interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}
