
import { UserTableSectionProps } from "@/components/SuperAdmin/UserManagement/types";

// Helper function to provide default values for UserTableSectionProps in tests
export const withDefaultUserTableProps = (props: Partial<UserTableSectionProps>): UserTableSectionProps => {
  return {
    users: props.users || [],
    loading: props.loading || false,
    isLoading: props.isLoading || false,
    currentPage: props.currentPage || 1,
    pageSize: props.pageSize || 10,
    onPageChange: props.onPageChange || (() => {}),
    onPageSizeChange: props.onPageSizeChange || (() => {}),
    totalItems: props.totalItems || props.totalUsers || 0,
    totalUsers: props.totalUsers || props.totalItems || 0,
    totalPages: props.totalPages || 1,
    onEditUser: props.onEditUser,
    onEdit: props.onEdit || (() => Promise.resolve()),
    onDeactivateUser: props.onDeactivateUser,
    onDeactivate: props.onDeactivate || (() => Promise.resolve()),
    onResetPassword: props.onResetPassword || (() => Promise.resolve()),
    onResetPasswordUser: props.onResetPasswordUser,
    handleEditUser: props.handleEditUser,
    handleResetPassword: props.handleResetPassword,
    handleDeactivateUser: props.handleDeactivateUser
  };
};
