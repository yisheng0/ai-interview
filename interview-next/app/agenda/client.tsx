'use client';

import { Box, Divider, Stack, useTheme, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ConfirmDialog from './_component/confirm-dialog';
import CreateEditDialog from './_component/create-edit-dialog';
import InterviewDetail from './_component/interview-detail';
import InterviewList from './_component/interview-list';
import PageHeader from './_component/page-header';
import ResumeInfo from './_component/resume-info';
import { useInterviewStore } from '@/state/interview-store';
import { Interview } from '@/api/services/interviewService';
import { clientLogger } from '@/utils/logger';

/**
 * 面试日程页面属性接口
 */
export interface InterviewAgendaClientModuleProps {
  interviewList: Interview[];
  resumeInfo?: any | null;
  interviewBalanceInfo: any | null;
}

/**
 * Web版面试日程页面组件
 *
 * 使用Grid布局将页面分为上下两部分，上部分包含头部和简历信息，
 * 下部分分为左右两栏，左侧是面试列表，右侧是面试详情。
 *
 * @param {InterviewAgendaClientModuleProps} props - 组件属性
 * @returns {JSX.Element} 面试日程页面
 */
export default function InterviewAgendaClientModule({
  interviewList: initialInterviewList = [],
  resumeInfo = null,
  interviewBalanceInfo = null,
}: InterviewAgendaClientModuleProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { currentInterview, setCurrentInterview, fetchInterviews, interviews } = useInterviewStore();
  // 响应式布局 - 小屏幕检测
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // 监听页面路径变化，保证从会话页面返回后触发重加载
  useEffect(() => {
    fetchInterviews();
    clientLogger.info('获取面试列表', interviews);
  }, [pathname, router, fetchInterviews]);

  // 初始化时如果没有选中的面试，且有面试列表，则选中第一个
  useEffect(() => {
    if (!currentInterview && interviews.length > 0) {
      setCurrentInterview(interviews[0]);
    }
  }, [interviews, currentInterview, setCurrentInterview]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
        bgcolor: theme => theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      {/* 上部分：页面头部 */}
      <Stack sx={{ height: '85px' }}>
        <PageHeader interviewTimeBalance={interviewBalanceInfo?.balance || 0} />
      </Stack>
      <Divider />
      {/* 下部分：简历信息、面试列表和详情 */}
      <Stack 
        direction={isSmallScreen ? 'column' : 'row'} 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          height: 'calc(100% - 85px)' // 减去头部高度
        }}
      >
        {/* 左侧：简历信息和面试列表 */}
        <Box 
          sx={{ 
            width: isSmallScreen ? '100%' : '65%', 
            p: { xs: 2, md: 4 },
            height: isSmallScreen ? 'auto' : '100%',
            overflowY: 'auto'
          }}
        >
          <ResumeInfo />
          <InterviewList interviewList={interviews.length > 0 ? interviews : initialInterviewList} />
        </Box>

        {/* 右侧：面试详情 */}
        <Box 
          sx={{ 
            width: isSmallScreen ? '100%' : '35%', 
            p: { xs: 2, md: 4 },
            height: isSmallScreen ? 'auto' : '100%',
            overflowY: 'auto',
            borderLeft: isSmallScreen ? 'none' : `1px solid ${theme.palette.divider}`
          }}
        >
          <InterviewDetail />
        </Box>
      </Stack>

      {/* 确认对话框 */}
      <ConfirmDialog />

      {/* 创建/编辑面试弹窗 */}
      <CreateEditDialog />
    </Box>
  );
}