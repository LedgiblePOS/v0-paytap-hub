
import { UserRole } from "@/types/user";

export interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  isActive?: boolean;
  merchant_id?: string | null;
  merchantId?: string | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface NewUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  confirmPassword?: string;
}

export interface EditUserData extends UserData {
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface UserDialogsSectionProps {
  isNewUserOpen: boolean;
  setNewUserOpen: (open: boolean) => void;
  isEditUserOpen: boolean;
  setEditUserOpen: (open: boolean) => void;
  showResetPasswordDialog: boolean;
  setShowResetPasswordDialog: (open: boolean) => void;
  showDeactivateDialog: boolean;
  setShowDeactivateDialog: (open: boolean) => void;
  selectedUser: UserData | null;
  editUserData: EditUserData | null;
  resetPasswordEmail: string;
  actionLoading: boolean;
  createUser: () => Promise<any>;
  handleUpdateUser: (userData: any) => Promise<any>;
  executeDeactivateUser: () => Promise<void>;
  setEditUserData: React.Dispatch<React.SetStateAction<EditUserData | null>>;
}
