import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/types/auth';
import { UserRole } from '@prisma/client';

interface AuthState {
  user: AuthResponse['user'] | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: AuthResponse) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
  updateUser: (user: Partial<AuthResponse['user']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: (data: AuthResponse) => {
        set({
          user: data.user,
          accessToken: data.tokens.accessToken,
          refreshToken: data.tokens.refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateTokens: (accessToken: string, refreshToken?: string) => {
        set({
          accessToken,
          ...(refreshToken && { refreshToken }),
        });
      },

      updateUser: (userData: Partial<AuthResponse['user']>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Role-based hooks
export const useIsAdmin = () => {
  const user = useUser();
  return user?.role === UserRole.ADMIN;
};

export const useIsDoctor = () => {
  const user = useUser();
  return user?.role === UserRole.DOCTOR;
};

export const useIsPatient = () => {
  const user = useUser();
  return user?.role === UserRole.PATIENT;
};

export const useHasRole = (roles: UserRole[]) => {
  const user = useUser();
  return user ? roles.includes(user.role) : false;
};