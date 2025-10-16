import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useNavigation() {
  const router = useRouter();

  const navigate = useCallback((path: string) => {
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback for navigation
      window.location.href = path;
    }
  }, [router]);

  const goBack = useCallback(() => {
    try {
      router.back();
    } catch (error) {
      console.error('Go back error:', error);
      // Fallback for going back
      window.history.back();
    }
  }, [router]);

  const refresh = useCallback(() => {
    try {
      router.refresh();
    } catch (error) {
      console.error('Refresh error:', error);
      // Fallback for refresh
      window.location.reload();
    }
  }, [router]);

  return {
    navigate,
    goBack,
    refresh,
    push: navigate,
  };
}