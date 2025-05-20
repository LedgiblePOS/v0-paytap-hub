import { supabase } from '@/lib/supabase';
import { UserData, User } from '@/types/user';
import { UserRole } from '@/types/enums';

// Mock user data for development
const mockUsers: Partial<UserData>[] = [
  {
    id: '1',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    role: 'ADMIN',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'merchant@example.com',
    first_name: 'Merchant',
    last_name: 'User',
    role: 'MERCHANT',
    is_active: true,
    merchant_id: '123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Fetches user data from the database by ID
 */
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Ensure all required fields are present in the returned data
    const userData: UserData = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'USER',
      is_active: data.is_active !== false,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || new Date().toISOString(),
      merchant_id: data.merchant_id
    };

    return userData;
  } catch (error) {
    console.error('Unexpected error in getUserData:', error);
    return null;
  }
};

/**
 * Updates user data in the database
 */
export const updateUserData = async (userId: string, updateData: Partial<any>): Promise<UserData | null> => {
  try {
    // Map from camelCase to snake_case if needed
    const dataToUpdate: any = {};
    
    if ('firstName' in updateData) dataToUpdate.first_name = updateData.firstName;
    if ('lastName' in updateData) dataToUpdate.last_name = updateData.lastName;
    if ('role' in updateData) dataToUpdate.role = updateData.role;
    if ('isActive' in updateData) dataToUpdate.is_active = updateData.isActive;
    
    // If there are snake_case properties, use them directly
    if ('first_name' in updateData) dataToUpdate.first_name = updateData.first_name;
    if ('last_name' in updateData) dataToUpdate.last_name = updateData.last_name;
    if ('role' in updateData) dataToUpdate.role = updateData.role;
    if ('is_active' in updateData) dataToUpdate.is_active = updateData.is_active;
    
    // Add timestamp for updated_at
    dataToUpdate.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('profiles')
      .update(dataToUpdate)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user data:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Cast to UserData with required fields
    const userData: UserData = {
      id: data.id,
      email: data.email || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      role: data.role || 'USER',
      is_active: data.is_active !== false, 
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      merchant_id: data.merchant_id
    };

    return userData;
  } catch (error) {
    console.error('Unexpected error in updateUserData:', error);
    return null;
  }
};

/**
 * Lists all users with optional filtering and pagination
 */
export const listUsers = async (options: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search
    } = options;
    
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (role && role !== 'ALL') {
      query = query.eq('role', role);
    }
    
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query.range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error listing users:', error);
      return { users: [], total: 0 };
    }
    
    return {
      users: data || [],
      total: count || 0
    };
  } catch (error) {
    console.error('Unexpected error in listUsers:', error);
    return { users: [], total: 0 };
  }
};

/**
 * Fetches user profile from the database by ID
 */
export const fetchUserProfile = async (userId: string): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    if (!data) throw new Error('User profile not found');
    
    // Add missing fields for compatibility
    const userData = {
      ...data,
      email: data.email || '',
      is_active: data.is_active !== false,
      merchant_id: data.merchant_id || null
    };

    // Convert snake_case to camelCase
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role as UserRole,
      isActive: userData.is_active,
      merchantId: userData.merchant_id,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    // Return mock user for development
    const mockUser = mockUsers.find(u => u.id === userId) as UserData;
    
    if (!mockUser) {
      throw new Error('User not found');
    }

    // Add missing fields if they don't exist
    const userData = {
      ...mockUser,
      email: mockUser.email || '',
      is_active: mockUser.is_active !== false,
      merchant_id: mockUser.merchant_id || null
    };

    // Convert snake_case to camelCase
    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: userData.role as UserRole,
      isActive: userData.is_active,
      merchantId: userData.merchant_id,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    };
  }
};
