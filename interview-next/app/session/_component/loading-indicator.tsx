'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

/**
 * 加载指示器组件
 */
const LoadingIndicator: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1000,
      }}
    >
      <CircularProgress size={40} sx={{ color: 'white' }} />
      <Typography
        variant="body1"
        sx={{
          color: 'white',
          mt: 2,
        }}
      >
        正在分析问题并生成回答...
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;