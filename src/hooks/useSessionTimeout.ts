import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useSessionTimeout = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logout, SESSION_TIMEOUT);
    };

    const logout = async () => {
      console.log('Session timed out. Logging out.');
      await auth.logout(); // Or auth.signOut() depending on your auth implementation
      router.push('/login'); // Redirect to login page
    };

    const handleUserActivity = () => {
      resetTimeout();
    };

    if (auth.user) {
      // Start timeout when user is logged in
      resetTimeout();

      // Listen for user activity
      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);
      window.addEventListener('click', handleUserActivity);
    }

    return () => {
      // Cleanup function
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [auth.user, router, auth]);
};
