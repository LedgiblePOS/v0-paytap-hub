
// Re-export all authentication-related functions and types
export * from './authenticationService';
export * from './userDataService';
export * from './permissionService';

// Add any missing exports that might be needed
export const resetPassword = async (email: string): Promise<boolean> => {
  // This is a placeholder for the actual resetPassword function
  console.log(`Resetting password for ${email}`);
  return true;
};

export const sendResetPasswordEmail = async (email: string): Promise<boolean> => {
  // This is a placeholder for the actual sendResetPasswordEmail function
  console.log(`Sending reset password email to ${email}`);
  return true;
};
