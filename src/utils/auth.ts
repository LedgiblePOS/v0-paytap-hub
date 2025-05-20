
import { supabase } from '@/integrations/supabase/client';

export const isAuthenticated = (): boolean => {
  const session = supabase.auth.getSession();
  return !!session;
};
