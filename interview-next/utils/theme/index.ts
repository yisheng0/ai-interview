'use client';

import { createTheme, Theme } from '@mui/material/styles';
import { components } from './components';
import { lightPalette, darkPalette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';

// 创建亮色主题
export const lightTheme = createTheme({
  palette: lightPalette,
  shadows,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

// 创建暗色主题
export const darkTheme = createTheme({
  palette: darkPalette,
  shadows,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

// 主题生成函数
export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};

export default { lightTheme, darkTheme, getTheme }; 