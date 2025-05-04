'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

/**
 * 会话布局组件属性
 */
interface SessionLayoutProps {
  /**
   * 子组件
   */
  children: ReactNode;
}

/**
 * 会话三栏布局组件
 *
 * 提供面试会话页面的三栏布局结构
 */
export default function SessionLayout({ children }: SessionLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 'calc(100vh - 64px)', // 减去顶部导航栏高度
        overflow: 'hidden',
        bgcolor: theme => theme.palette.background.default,
        padding: '16px',
        gap: '17.5px',
      }}
    >
      {children}
    </Box>
  );
}