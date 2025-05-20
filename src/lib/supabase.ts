
// Re-export the supabase client from the integrations directory
import { supabase } from '@/integrations/supabase/client';

// Export the client for backward compatibility
export { supabase };

// Log to console in development
if (import.meta.env.DEV) {
  console.log('Supabase client imported from @/lib/supabase');
}
