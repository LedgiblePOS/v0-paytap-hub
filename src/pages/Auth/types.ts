
/**
 * Shared type definitions for authentication components
 */

export interface LoginFormProps {
  /** Called when login is successful */
  onSuccess?: () => void;
  /** Called when login encounters an error */
  onError?: (error: string) => void;
  /** Whether to show the register link */
  showRegisterLink?: boolean;
  /** Path to redirect to after successful login */
  redirectPath?: string;
  /** Type of user being authenticated */
  userType?: 'merchant' | 'admin' | undefined;
}

export interface LoginFormWrapperProps extends Pick<LoginFormProps, 'onSuccess' | 'onError' | 'redirectPath' | 'userType'> {
  /** Title displayed at the top of the login form */
  title: string;
  /** Description text displayed below the title */
  description: string;
  /** Whether to show the register link */
  showRegisterLink?: boolean;
  /** Additional content to render below the form */
  children?: React.ReactNode;
}
