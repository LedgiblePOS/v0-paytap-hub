
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCheckSuperAdmin = () => {
  const [superAdminExists, setSuperAdminExists] = useState<boolean | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        setIsCheckingAdmin(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'SUPER_ADMIN')
          .limit(1);
          
        if (error) {
          throw error;
        }
        
        setSuperAdminExists(data && data.length > 0);
      } catch (err: any) {
        console.error("Error checking for super admin:", err);
        setSuperAdminExists(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkSuperAdmin();
  }, []);

  return { superAdminExists, isCheckingAdmin };
};
