'use client';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import editSvg from '@/public/svg/interview-agenda-edtior.svg';
import interSvg from '@/public/svg/interview-agenda-inter.svg';
import resumeSvg from '@/public/svg/interview-agenda-resume.svg';
import Image from 'next/image';
import { InterviewStatus, type Interview } from '@/state/interview-store';
import { useModalStore } from '@/state/dialog-store';
import { useRouter } from 'next/navigation';

/**
 * 简历信息卡片组件
 *
 * 显示用户简历信息，如果没有简历则显示创建简历按钮
 *
 * @returns {JSX.Element} 简历信息卡片组件
 */
export default function ResumeInfo() {
  const router = useRouter();
  // 从全局状态获取对话框控制方法
  const { openInterviewAgendaDetailDialog } = useModalStore();

  // 处理点击编辑简历按钮
  const handleEditResume = () => {
    router.push('/resume');
  };

  /**
   * 处理点击创建岗位按钮
   * 打开创建面试对话框
   */
  const handleCreatePosition = () => {
    // 打开空白的创建面试对话框
    openInterviewAgendaDetailDialog(null);
  };

  /**
   * 处理点击快速面试按钮
   * 创建一个默认面试并直接进入面试
   */
  const handleQuickInterview = async () => {
    // 预填充默认面试数据
    const quickInterviewData: Interview = {
      company_name: '快速面试',
      job_title: '前端开发工程师',
      introduction: '这是一个快速面试，无需详细设置即可开始。',
      interview_status: InterviewStatus.IN_PROGRESS,
      interview_round_list: [
        {
          round_no: 1,
          round_name: '面试官提问',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(), // 1小时后
        }
      ]
    };

    // 打开预填充的面试对话框
    openInterviewAgendaDetailDialog(quickInterviewData);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        bgcolor: (theme) => theme.palette.background.default,
        mb: 2
      }}
    >
      {/* 左侧：简历信息 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Image src={resumeSvg} alt="简历" width={64} height={60} />
        <Stack>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="medium">
              我的简历
            </Typography>
            <Typography variant="body2" color="primary" fontWeight="bold" onClick={handleEditResume} sx={{ cursor: 'pointer' }}>
              编辑
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            AI将结合你的简历作答，
            <Typography component="span" variant="body2" color="primary" fontWeight="bold">
              准确率UP！
            </Typography>
          </Typography>
        </Stack>
      </Stack>

      {/* 右侧：快速面试/创建岗位按钮 */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleQuickInterview}
          sx={{
            borderRadius: 2,
            width: '158px',
            height: '73px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src={interSvg} alt="进入面试" width={38.5} height={38.5} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: 0.2,
              }}
            >
              <Typography
                fontWeight="medium"
                sx={{
                  fontSize: '16px',
                  color: 'primary.contrastText',
                }}
              >
                快速面试
              </Typography>
              <Typography
                fontWeight="medium"
                sx={{
                  fontSize: '12px',
                  color: 'primary.contrastText',
                  opacity: 0.7,
                }}
              >
                立刻进入面试
              </Typography>
            </Box>
          </Box>
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreatePosition}
          sx={{
            borderRadius: 2,
            width: '158px',
            height: '73px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src={editSvg} alt="编辑" width={38.5} height={38.5} />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: 0.2,
              }}
            >
              <Typography
                fontWeight="medium"
                sx={{
                  fontSize: '16px',
                  color: 'primary.contrastText',
                }}
              >
                创建岗位
              </Typography>
              <Typography
                fontWeight="medium"
                sx={{
                  fontSize: '12px',
                  color: 'primary.contrastText',
                  opacity: 0.7,
                }}
              >
                AI提示更准确
              </Typography>
            </Box>
          </Box>
        </Button>
      </Stack>
    </Paper>
  );
}