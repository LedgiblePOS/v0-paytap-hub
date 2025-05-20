
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { UserRole } from '@/types/enums';
import { EditUserData } from '@/types/user';

interface UserRoleFieldProps {
  form: UseFormReturn<EditUserData>;
}

const UserRoleField: React.FC<UserRoleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User Role</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(value as UserRole)} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.MERCHANT}>Merchant</SelectItem>
              <SelectItem value={UserRole.USER}>User</SelectItem>
              <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
              <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default UserRoleField;
