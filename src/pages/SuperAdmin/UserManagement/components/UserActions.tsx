
import React from "react";
import { 
  Edit, 
  Key, 
  UserX,
  UserPlus,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import PermissionButton from "@/components/Auth/PermissionButton";
import { Permission } from "@/utils/permissions/types";
import { EditUserData } from "@/components/SuperAdmin/User/utils/userDataConverter";

interface UserActionsProps {
  user: EditUserData;
  onEdit: (user: EditUserData) => void;
  onResetPassword: (email: string) => void;
  onDeactivate: (userId: string) => void;
  onAdd: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onEdit,
  onResetPassword,
  onDeactivate,
  onAdd
}) => {
  return (
    <div className="flex space-x-2">
      {/* Add User Button - Only show if user has create permission */}
      <PermissionButton
        permission={Permission.CREATE_USER}
        variant="default"
        size="sm"
        onClick={onAdd}
        hideIfDenied={true}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Add User
      </PermissionButton>
      
      {/* Action Dropdown - For per-user actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Edit User - Requires edit permission */}
          <DropdownMenuItem
            onClick={() => onEdit(user)}
            disabled={!user.id}
            className="cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit User
          </DropdownMenuItem>
          
          {/* Reset Password - Requires edit permission */}
          <DropdownMenuItem
            onClick={() => user.email && onResetPassword(user.email)}
            disabled={!user.email}
            className="cursor-pointer"
          >
            <Key className="h-4 w-4 mr-2" />
            Reset Password
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Deactivate User - Requires delete permission */}
          <DropdownMenuItem
            onClick={() => onDeactivate(user.id)}
            className="text-red-600 focus:text-red-600 cursor-pointer"
            disabled={!user.id}
          >
            <UserX className="h-4 w-4 mr-2" />
            Deactivate User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserActions;
