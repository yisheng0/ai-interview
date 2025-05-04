'use client';

import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { ThemeToggle } from '@/components';

/**
 * 页面头部组件属性接口
 */
interface PageHeaderProps {
  interviewTimeBalance: number;
}

/**
 * 页面头部组件
 *
 * 包含用户头像、姓名和剩余面试时长等信息
 *
 * @param {PageHeaderProps} props - 组件属性
 * @returns {JSX.Element} 页面头部组件
 */
export default function PageHeader({ interviewTimeBalance = 0 }: PageHeaderProps) {
  // 判断用户是否为付费用户
  const isPremium = interviewTimeBalance > 0;
  // 模拟用户昵称
  const nickname = "用户";

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: (theme) => theme.palette.background.default,
        pl: 5,
        pr: 5,
      }}
    >
      {/* 左侧：行向标题 */}
      <Stack direction="row" alignItems="center" spacing={1}>
          <Image src="/png/desktop-tracep-logo.png" alt="行向" width={136} height={63} />
      </Stack>

      {/* 右侧：用户信息和面试时长 */}
      <Stack direction="row" alignItems="center" spacing={3}>
        {/* 面试时长 */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: 'pointer' }}>
          <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
            <span style={{ fontWeight: '400' }}>剩余面试时长</span>{' '}
            {interviewTimeBalance}分钟
          </Typography>
        </Stack>
        {/* 主题切换 */}
        <ThemeToggle />
        {/* 用户头像 */}
        <Box sx={{ position: 'relative', width: 40, height: 40 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              cursor: 'pointer',
              typography: 'body1',
            }}
          >
            {nickname?.charAt(0) ?? 'U'}
          </Avatar>
        </Box>
      </Stack>
    </Paper>
  );
}