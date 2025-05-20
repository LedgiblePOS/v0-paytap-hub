
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserRole } from '@/types/enums';
import { UserFormProps } from '@/types/user';

const UserForm: React.FC<UserFormProps> = ({ 
  userData, 
  onChange, 
  isNewUser = false
}) => {
  const handleChange = (field: string, value: any) => {
    // Update both camelCase and snake_case versions for compatibility
    const updates: any = {
      [field]: value
    };
    
    // Map camelCase fields to their snake_case equivalents
    if (field === 'firstName') updates.first_name = value;
    if (field === 'lastName') updates.last_name = value;
    if (field === 'isActive') updates.is_active = value;
    if (field === 'merchantId') updates.merchant_id = value;

    onChange({ ...userData, ...updates });
  };

  return (
    <div className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="First name"
            value={userData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Last name"
            value={userData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          value={userData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>

      {isNewUser && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder={isNewUser ? "Password" : "Leave blank to keep current password"}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={userData.role}
          onValueChange={(value) => handleChange('role', value)}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.MERCHANT}>Merchant</SelectItem>
            <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
            <SelectItem value={UserRole.USER}>User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="isActive"
          checked={userData.isActive}
          onCheckedChange={(checked) => handleChange('isActive', checked)}
        />
        <Label htmlFor="isActive">Active Account</Label>
      </div>
    </div>
  );
};

export default UserForm;
