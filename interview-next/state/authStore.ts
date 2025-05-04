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
  setAuth: (token, userId, username) => {
    // 设置状态
    set({ token, userId, username });
    
    // 在客户端环境下，同步更新cookie
    if (typeof document !== 'undefined') {
      document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
  },
  clearAuth: () => {
    // 重置状态
    set(initialState);
    
    // 在客户端环境下，清除cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax';
    }
  },
}));

