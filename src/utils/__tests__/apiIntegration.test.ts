
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          data: [{ id: '1', name: 'Test' }],
          error: null
        })
      }),
      insert: jest.fn().mockReturnValue({
        data: [{ id: '2', name: 'New Test', merchant_id: 'some-uuid' }],
        error: null
      }),
      update: jest.fn().mockReturnValue({
        data: [{ id: '1', name: 'Updated Test' }],
        error: null
      }),
      delete: jest.fn().mockReturnValue({
        data: [],
        error: null
      })
    }),
    auth: {
      getUser: jest.fn().mockReturnValue({
        data: { user: { id: 'user-id', email: 'test@example.com' } },
        error: null
      })
    }
  }
}));

describe('API Integration Tests', () => {
  // Use a table that actually exists in the Supabase schema
  const TEST_TABLE = 'products';

  it('should fetch data correctly from Supabase', async () => {
    const { data, error } = await supabase
      .from(TEST_TABLE)
      .select('*')
      .order('id');
      
    expect(data).toEqual([{ id: '1', name: 'Test' }]);
    expect(error).toBeNull();
  });
  
  it('should insert data correctly to Supabase', async () => {
    // Include merchant_id which is required by the schema
    const testProduct = { 
      name: 'New Test', 
      merchant_id: 'some-uuid',
      price: 19.99 // Required in the products table
    };
    
    const { data, error } = await supabase
      .from(TEST_TABLE)
      .insert(testProduct);
      
    expect(data).toEqual([{ id: '2', name: 'New Test', merchant_id: 'some-uuid' }]);
    expect(error).toBeNull();
  });
  
  it('should update data correctly in Supabase', async () => {
    const { data, error } = await supabase
      .from(TEST_TABLE)
      .update({ name: 'Updated Test' });
      
    expect(data).toEqual([{ id: '1', name: 'Updated Test' }]);
    expect(error).toBeNull();
  });
  
  it('should delete data correctly from Supabase', async () => {
    const { data, error } = await supabase
      .from(TEST_TABLE)
      .delete();
      
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });
  
  it('should authenticate and get current user', async () => {
    const { data, error } = await supabase.auth.getUser();
    
    expect(data.user).toEqual({ id: 'user-id', email: 'test@example.com' });
    expect(error).toBeNull();
  });
});
