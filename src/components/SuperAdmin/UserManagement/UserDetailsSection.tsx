import React from 'react';
import { EditUserData } from '@/types/user';

export interface UserDetailsSectionProps {
  selectedUser?: EditUserData | null;
}

const UserDetailsSection: React.FC<UserDetailsSectionProps> = ({ selectedUser }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">User Details</h2>
      {selectedUser ? (
        <div className="space-y-2">
          <p><strong>ID:</strong> {selectedUser.id}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>First Name:</strong> {selectedUser.firstName}</p>
          <p><strong>Last Name:</strong> {selectedUser.lastName}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          <p><strong>Active:</strong> {selectedUser.isActive ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {selectedUser.createdAt}</p>
          <p><strong>Updated At:</strong> {selectedUser.updatedAt}</p>
        </div>
      ) : (
        <p>No user selected.</p>
      )}
    </div>
  );
};

export default UserDetailsSection;
