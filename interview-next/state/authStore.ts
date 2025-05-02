import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: string | null;
  username: string | null;
}

interface AuthActions {
  setAuth: (token: string, userId: string, username: string) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  token: null,
  userId: null,
  username: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  setAuth: (token, userId, username) => set({ token, userId, username }),
  clearAuth: () => set(initialState),
}));

