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

/**
 * 从cookie中获取token
 * @returns token字符串或null
 */
function getTokenFromCookie(): string | null {
  // 只在客户端环境执行
  if (typeof document === 'undefined') return null;
  
  // 从cookie中获取auth-token
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('auth-token=')) {
      return cookie.substring('auth-token='.length);
    }
  }
  return null;
}

// 从cookie中读取token初始化状态
const cookieToken = getTokenFromCookie();

const initialState: AuthState = {
  token: cookieToken,
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

