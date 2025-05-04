'use client';

import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

/**
 * 点动画关键帧
 */
const dotAnimation = keyframes`
  0% { transform: scale(0.5); opacity: 0.3; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.5); opacity: 0.3; }
`;

/**
 * 加载指示器组件属性
 */
interface LoadingIndicatorProps {
  /**
   * 点的数量
   */
  dotsCount?: number;
  /**
   * 指示器颜色
   */
  color?: string;
}

/**
 * 加载指示器组件
 *
 * 显示加载状态的动画指示器，由多个点组成
 * 设计稿中三个小点加一个大点的加载指示器
 */
export default function LoadingIndicator({
  dotsCount = 4,
  color,
}: LoadingIndicatorProps) {
  // 创建点的数组
  const dots = Array.from({ length: dotsCount }, (_, i) => i);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {dots.map(i => (
        <Box
          key={i}
          sx={{
            width: i === dots.length - 1 ? '6px' : '4px',
            height: i === dots.length - 1 ? '6px' : '4px',
            borderRadius: '50%',
            backgroundColor: color || (theme => theme.palette.primary.main),
            animation: `${dotAnimation} 1.2s infinite ease-in-out`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </Box>
  );
}