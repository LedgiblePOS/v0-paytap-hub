
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import enhancedAuditService, { AuditSeverity } from './enhancedAuditService';

interface NewUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}

interface UserListParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  roleFilter?: UserRole | null;
  activeFilter?: boolean | null;
}

class UserService {
  /**
   * Fetch users with pagination and filtering
   */
  async getUsers(params: UserListParams): Promise<{ users: User[]; total: number }> {
    try {
      const { page, pageSize, searchTerm, roleFilter, activeFilter } = params;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Start with basic query
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }
      
      if (activeFilter !== null) {
        query = query.eq('is_active', activeFilter);
      }
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        users: data as unknown as User[],
        total: count || 0,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: NewUserData): Promise<User> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || this.generateTempPassword(),
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
        },
      });

      if (authError) throw authError;

      // Log audit event
      enhancedAuditService.logSecurityEvent({
        action: 'USER_CREATED',
        description: `New user created: ${userData.email} with role ${userData.role}`,
        userId: (await supabase.auth.getUser()).data.user?.id,
        severity: AuditSeverity.INFO,
        metadata: {
          newUserId: authData.user?.id,
          userEmail: userData.email,
          userRole: userData.role,
        }
      });

      // Return the created user
      return {
        id: authData.user?.id || '',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(userData: Partial<User> & { id: string }): Promise<void> {
    try {
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.id);

      if (error) throw error;

      // Log audit event
      enhancedAuditService.logSecurityEvent({
        action: 'USER_UPDATED',
        description: `User ${userData.id} updated`,
        userId: (await supabase.auth.getUser()).data.user?.id,
        severity: AuditSeverity.INFO,
        metadata: {
          userId: userData.id,
          changes: {
            role: userData.role,
            name: `${userData.firstName} ${userData.lastName}`,
          }
        }
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Deactivate/activate a user
   */
  async deactivateUser(userId: string): Promise<void> {
    try {
      // Get current state
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Toggle active state
      const newState = !data.is_active;

      // Update user active state
      const { error } = await supabase
        .from('profiles')
        .update({
          is_active: newState,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      // Log audit event
      enhancedAuditService.logSecurityEvent({
        action: newState ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
        description: `User ${userId} ${newState ? 'activated' : 'deactivated'}`,
        userId: (await supabase.auth.getUser()).data.user?.id,
        severity: AuditSeverity.WARNING,
        metadata: { targetUserId: userId }
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      // Log audit event
      enhancedAuditService.logSecurityEvent({
        action: 'PASSWORD_RESET_REQUESTED',
        description: `Password reset requested for ${email}`,
        userId: (await supabase.auth.getUser()).data.user?.id,
        severity: AuditSeverity.INFO,
        metadata: { userEmail: email }
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      throw error;
    }
  }

  /**
   * Generate a temporary password
   */
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    
    // Generate random 12 character password
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }
}

export const userService = new UserService();
