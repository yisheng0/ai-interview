import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

/**
 * 根据主题模式获取 MUI 主题对象
 * @param mode 主题模式 ('light' | 'dark')
 * @returns MUI 主题对象
 */
export function getTheme(mode: PaletteMode = 'light') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#117CEE', // 行向蓝色
        light: '#4D97F1',
        dark: '#0C5CBC',
      },
      secondary: {
        main: '#19B1B6', // 行向青色
        light: '#4DBFC3',
        dark: '#127C7F',
      },
      success: {
        main: '#4CAF50',
        light: '#81C784',
        dark: '#388E3C',
      },
      error: {
        main: '#F44336',
        light: '#E57373',
        dark: '#D32F2F',
      },
      warning: {
        main: '#FFC107',
        light: '#FFD54F',
        dark: '#FFA000',
      },
      info: {
        main: '#2196F3',
        light: '#64B5F6',
        dark: '#1976D2',
      },
      background: {
        default: mode === 'light' ? '#f1fafe' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#333333' : '#ffffff',
        secondary: mode === 'light' ? '#666666' : '#b0b0b0',
      },
    },
    typography: {
      fontFamily: [
        'var(--font-geist-sans)',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });
}