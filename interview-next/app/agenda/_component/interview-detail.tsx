'use client';

import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';

/**
 * 面试详情组件
 *
 * 显示选中面试的详细信息，包括公司、职位、轮次、描述等
 *
 * @returns {JSX.Element} 面试详情组件
 */
export default function InterviewDetail() {
  // // 示例数据
  // const currentInterview = null;

  // // 如果没有选中的面试，则显示空状态
  // if (!currentInterview) {
  //   return (
  //     <Paper
  //       elevation={0}
  //       sx={{
  //         height: '100%',
  //         borderRadius: 2,
  //         overflow: 'hidden',
  //         display: 'flex',
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         bgcolor: 'background.paper',
  //       }}
  //     >
  //       <Typography variant="body1" color="text.secondary">
  //         请选择面试以查看详情
  //       </Typography>
  //     </Paper>
  //   );
  // }

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* 顶部信息区域 */}
      <Box
        sx={{
          px: 4,
          py: 2,
          position: 'relative',
        }}
      >
        {/* 公司名称和面试轮次 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight="medium" sx={{ fontSize: '24px', fontWeight: 600 }}>
            示例公司
          </Typography>
          <Chip
            label="一面"
            size="small"
            sx={{
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              color: 'primary.main',
              height: 24,
              fontWeight: 500,
            }}
          />
        </Stack>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary' }}>
          前端开发工程师
        </Typography>

        {/* 状态操作tag */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(116, 182, 2, 0.24)',
              borderColor: 'rgba(76, 175, 80, 0.2)',
              color: 'success.main',
              px: 2,
              py: 0.5,
            }}
          >
            顺利通过
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderRadius: 4,
              bgcolor: 'rgba(223, 42, 63, 0.24)',
              borderColor: 'rgba(244, 67, 54, 0.2)',
              color: 'error.main',
              px: 2,
              py: 0.5,
            }}
          >
            遗憾终止
          </Button>
        </Stack>
      </Box>

      <Divider />

      {/* 主体内容区域 */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 4 }}>
        <Typography
          variant="h6"
          fontWeight="medium"
          gutterBottom
          sx={{ mt: 2, color: 'secondary.main' }}
        >
          岗位描述
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-line',
            mb: 3,
          }}
        >
          这是一个示例岗位描述，展示了面试详情界面的布局和样式。
        </Typography>
      </Box>

      {/* 底部操作按钮 */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          进入面试
        </Button>
      </Box>
    </Paper>
  );
}