'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

/**
 * 声波图标属性接口
 */
interface WaveIconProps {
  /**
   * 是否处于动画状态
   */
  isAnimating: boolean;
}

/**
 * 语音识别波形图标
 */
export const WaveIcon: React.FC<WaveIconProps> = ({ isAnimating }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '16px', gap: '2px' }}>
      {[1, 2, 3, 4].map((i) => (
        <Box
          key={i}
          sx={{
            width: '2px',
            height: `${Math.max(4, Math.random() * 16)}px`,
            backgroundColor: theme => theme.palette.primary.main,
            borderRadius: '1px',
            animation: isAnimating ? `wave-animation-${i} 1.2s infinite ease-in-out` : 'none',
            '@keyframes wave-animation-1': {
              '0%, 100%': { height: '6px' },
              '50%': { height: '10px' },
            },
            '@keyframes wave-animation-2': {
              '0%, 100%': { height: '8px' },
              '50%': { height: '14px' },
            },
            '@keyframes wave-animation-3': {
              '0%, 100%': { height: '10px' },
              '50%': { height: '6px' },
            },
            '@keyframes wave-animation-4': {
              '0%, 100%': { height: '4px' },
              '50%': { height: '12px' },
            },
          }}
        />
      ))}
    </Box>
  );
};

/**
 * 语音识别指示器组件
 */
const VoiceRecognitionIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '64px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '20px',
        backgroundColor: theme => theme.palette.background.paper,
        boxShadow: theme => theme.shadows[2],
        zIndex: 10,
      }}
    >
      <WaveIcon isAnimating={true} />
      <Typography
        variant="body2"
        sx={{
          ml: 1,
          color: theme => theme.palette.primary.main,
          fontWeight: 500,
        }}
      >
        正在聆听...
      </Typography>
    </Box>
  );
};

export default VoiceRecognitionIndicator;