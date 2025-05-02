'use client';

import { useThemeStore } from '@/state/themeStore';
import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

/**
 * 主题切换按钮组件
 * 允许用户在亮色和暗色主题之间切换
 */
export function ThemeToggle() {
  const { themeMode, toggleTheme } = useThemeStore();
  
  return (
    <Tooltip title={themeMode === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
      <IconButton onClick={toggleTheme} color="inherit" aria-label="切换主题">
        {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle; 