import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaletteOptions } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'light',
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleTheme: () => set((state) => ({ 
        themeMode: state.themeMode === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
); 