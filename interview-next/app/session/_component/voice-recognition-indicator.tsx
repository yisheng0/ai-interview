'use client';

import { Box } from '@mui/material';

/**
 * 声波动画组件
 * 功能：
 * 1. 显示声波动效
 * 2. 支持动画开关控制
 * 3. 可自定义声波数量
 *
 * @param isAnimating 是否开始播放动画
 * @param length 组件长度（短竖线数量）
 */
export const WaveIcon = ({
  isAnimating,
  length = 8,
}: {
  isAnimating: boolean;
  length?: number;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        height: 20,
      }}
    >
      {[...Array(length)].map((_, index) => (
        <Box
          key={index}
          sx={{
            width: '0.15rem',
            height: '1rem',
            bgcolor: theme => theme.palette.secondary.main,
            borderRadius: 4,
            ...(isAnimating && {
              animation: 'wave 1.5s ease-in-out infinite',
              animationDelay: `${-(length * 0.2) + index * 0.2}s`,
              '@keyframes wave': {
                '0%, 100%': {
                  transform: 'scaleY(0.2)',
                },
                '50%': {
                  transform: 'scaleY(1)',
                },
              },
            }),
          }}
        />
      ))}
    </Box>
  );
};