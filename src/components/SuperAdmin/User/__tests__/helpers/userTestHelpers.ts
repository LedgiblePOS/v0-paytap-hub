
import { UserData, UserRole } from '@/types';

export const createTestUserTableProps = (props: any) => {
  // Ensure loading property is always included
  return {
    ...props,
    loading: props.loading !== undefined ? props.loading : false
  };
};

export const createMockUsers = () => {
  return [
    {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      role: UserRole.ADMIN,
      is_active: true,
      created_at: "2023-01-01T00:00:00Z",
    },
    {
      id: "2",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane@example.com",
      role: UserRole.MERCHANT,
      is_active: false,
      created_at: "2023-01-02T00:00:00Z",
    }
  ];
};
