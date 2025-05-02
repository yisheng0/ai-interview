'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeStore } from '@/state/themeStore';
import { useEffect } from 'react';
import { getTheme } from '@/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeMode } = useThemeStore();
  
  // 获取主题对象
  const currentTheme = getTheme(themeMode);
  
  // 更新文档根元素的类名，与样式无关，只用于判断主题 + 过渡动画
  useEffect(() => {
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    document.documentElement.classList.add(`${themeMode}-theme`);
    
    // 添加一个主题过渡样式到 body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [themeMode]);
  
  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
} 