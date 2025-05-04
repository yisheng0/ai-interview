'use client';

import { StopCircle } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';

/**
 * 会话顶部导航栏组件属性
 */
interface SessionHeaderProps {
  //  计时器时间，格式为 HH:MM:SS
  timerText?: string;
  //  返回按钮点击处理函数
  onBackClick?: () => void;
  //  结束面试按钮点击处理函数
  onEndInterviewClick?: () => void;
}

/**
 * 会话顶部导航栏组件
 * 显示面试会话的顶部导航栏，包含返回按钮、计时器和结束面试按钮
 */
export default function SessionHeader({
  timerText = '00:00:02',
  onBackClick,
  onEndInterviewClick,
}: SessionHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 16px',
        borderBottom: '1px solid',
        borderColor: theme => theme.palette.divider,
        bgcolor: theme => theme.palette.background.paper,
      }}
    >
      {/* 左侧返回按钮和标题 */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Image src="/png/desktop-tracep-logo.png" alt="logo" width={118} height={54} />
      </Box>

      {/* 中间计时器 */}
      <Typography
        sx={{
          color: theme => theme.palette.text.secondary,
          fontWeight: 500,
          fontSize: '14px',
        }}
      >
        {timerText}
      </Typography>

      {/* 右侧结束面试按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ThemeToggle />
        <Button
          variant="contained"
        onClick={onEndInterviewClick}
        sx={{
          bgcolor: theme => theme.palette.error.light,
          color: theme => theme.palette.error.main,
          borderRadius: '7px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          '&:hover': {
            bgcolor: theme => theme.palette.error.light,
          },
        }}
      >
        <StopCircle
          sx={{
            color: theme => theme.palette.error.main,
            fontSize: 32,
            cursor: 'pointer',
          }}
          />
          结束面试
        </Button>
      </Box>
    </Box>
  );
}