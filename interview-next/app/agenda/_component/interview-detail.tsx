'use client';

import { Box, Button, Chip, Divider, IconButton, Menu, MenuItem, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import dayjs from 'dayjs';

// 模拟中文数字转换
const convertToChinese = (num: number) => {
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  return num <= 10 ? chineseNums[num] : `${num}`;
};

/**
 * 面试详情组件
 *
 * 显示选中面试的详细信息，包括公司、职位、轮次、描述等
 *
 * @returns {JSX.Element} 面试详情组件
 */
export default function InterviewDetail() {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 获取菜单打开状态
  const isMenuOpen = Boolean(menuAnchorEl);
  
  // 模拟面试数据
  const currentInterview = {
    uuid: '123',
    company_name: '示例公司',
    job_title: '前端开发工程师',
    introduction: '这是一个示例岗位描述，展示了面试详情界面的布局和样式。岗位需求包括：\n1. 熟练掌握React、Vue等前端框架\n2. 良好的CSS和HTML基础\n3. 了解前端工程化和构建工具\n4. 良好的团队协作能力',
    interview_status: 'IN_PROGRESS',
    interview_round_list: [
      {
        uuid: '1',
        round_no: 1,
        round_name: '一面',
        schedule_date: dayjs().add(1, 'day').toISOString()
      },
      {
        uuid: '2',
        round_no: 2,
        round_name: '二面',
        schedule_date: dayjs().add(3, 'day').toISOString()
      }
    ]
  };

  // 处理打开菜单
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  // 处理关闭菜单
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // 处理编辑面试
  const handleEdit = () => {
    handleMenuClose();
    console.log('编辑面试');
  };

  // 处理删除面试
  const handleDelete = () => {
    handleMenuClose();
    console.log('删除面试');
  };

  // 处理更新面试状态
  const handleStatusUpdate = (newStatus: string) => {
    console.log('更新状态为:', newStatus);
  };

  // 处理进入面试会话
  const handleEnterSession = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log('进入面试');
    }, 1000);
  };

  // 处理添加新的面试轮次
  const handleAddNewRound = () => {
    console.log('添加新轮次');
  };

  // 如果没有选中的面试，则显示空状态
  if (!currentInterview) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          请选择面试以查看详情
        </Typography>
      </Paper>
    );
  }

  // 获取面试轮次数量
  const roundCount = currentInterview.interview_round_list?.length || 0;

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
          backgroundImage: 'url(/img/interview-detail-bg.png)',
          backgroundPosition: 'top right',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '120px auto',
        }}
      >
        {/* 右上角三点菜单 */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
          }}
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEdit} sx={{ gap: 1 }}>
            <EditOutlinedIcon sx={{ fontSize: 20 }} />
            编辑
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ gap: 1, color: 'error.main' }}>
            <DeleteOutlineIcon sx={{ fontSize: 20, color: 'error.main' }} />
            删除
          </MenuItem>
        </Menu>

        {/* 公司名称和面试轮次 */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" fontWeight="medium" sx={{ fontSize: '24px', fontWeight: 600 }}>
            {currentInterview.company_name}
          </Typography>
          <Chip
            label={`${convertToChinese(roundCount)}面`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              height: 24,
              fontWeight: 500,
            }}
          />
        </Stack>
        <Typography variant="body1" sx={{ mt: 0.5, color: 'text.secondary' }}>
          {currentInterview.job_title}
        </Typography>

        {/* 状态操作tag */}
        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
          {currentInterview.interview_status === 'IN_PROGRESS' ? (
            <>
              {/* 顺利通过按钮 */}
              <Button
                variant="outlined"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => handleStatusUpdate('PASS')}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#74B6023D',
                  borderColor: alpha(theme.palette.success.main, 0.2),
                  color: theme.palette.success.main,
                  '&:hover': {
                    borderColor: theme.palette.success.main,
                    bgcolor: alpha(theme.palette.success.main, 0.2),
                  },
                  px: 2,
                  py: 0.5,
                }}
              >
                顺利通过
              </Button>

              {/* 遗憾中止按钮 */}
              <Button
                variant="outlined"
                startIcon={<CancelOutlinedIcon />}
                onClick={() => handleStatusUpdate('TERMINATE')}
                disabled={isSubmitting}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#DF2A3F3D',
                  borderColor: alpha(theme.palette.error.main, 0.2),
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                  px: 2,
                  py: 0.5,
                }}
              >
                遗憾终止
              </Button>
            </>
          ) : (
            /* 恢复流程按钮 */
            <Button
              variant="outlined"
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
              disabled={isSubmitting}
              sx={{
                borderRadius: 4,
                px: 2,
              }}
            >
              恢复流程
            </Button>
          )}
        </Stack>
      </Box>

      <Divider />

      {/* 主体内容区域 */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 4 }}>
        {currentInterview.interview_round_list &&
        currentInterview.interview_round_list.length > 0 ? (
          <Stack sx={{ mt: 2 }}>
            {currentInterview.interview_round_list.map((round, index) => {
              const isLastItem = index === currentInterview.interview_round_list.length - 1;
              return (
                <Box
                  key={round.uuid || index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: 2,
                    position: 'relative',
                  }}
                >
                  {/* 连接线 - 调整间距使其均匀 */}
                  {!isLastItem && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 18,
                        top: 36,
                        height: '16px',
                        width: 2,
                        bgcolor: 'divider',
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* 序号圆圈 - 只有最后一个高亮 */}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: isLastItem ? 'primary.main' : 'grey.400',
                      color: 'common.white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 2,
                      zIndex: 1,
                    }}
                  >
                    <Typography fontWeight="medium">{index + 1}</Typography>
                  </Box>

                  {/* 轮次内容 - 保持两端对齐 */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {/* 左侧：轮次名称 */}
                    <Typography fontWeight="medium">
                      第{convertToChinese(index + 1)}轮面试
                    </Typography>

                    {/* 右侧：面试时间 */}
                    {round.schedule_date && (
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(round.schedule_date).format('M月D日 HH:mm')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}

            {/* 添加下一轮按钮 - 使用虚线圆圈 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                ml: 0,
                cursor: 'pointer',
                color: 'primary.main',
              }}
              onClick={handleAddNewRound}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '1px dashed',
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 2,
                  color: 'primary.main',
                }}
              >
                <Typography>+</Typography>
              </Box>
              <Typography color="primary.main">添加下一轮面试</Typography>
            </Box>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            暂无面试轮次
          </Typography>
        )}

        {/* 岗位描述 */}
        <Typography
          variant="h6"
          fontWeight="medium"
          gutterBottom
          sx={{ mt: 2, color: '#19B1B6' }}
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
          {currentInterview.introduction || '暂无岗位描述'}
        </Typography>
      </Box>

      {/* 底部操作按钮 */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, gap: 2, display: 'flex'}}>
        <Button>回顾</Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleEnterSession}
          disabled={isSubmitting || currentInterview.interview_status !== 'IN_PROGRESS'}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
          }}
        >
          {isSubmitting ? '处理中...' : '进入面试'}
        </Button>
      </Box>
    </Paper>
  );
}