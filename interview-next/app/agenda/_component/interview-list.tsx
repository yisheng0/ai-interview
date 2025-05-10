'use client';

import { Box, Divider, Paper, Stack, Typography, Button } from '@mui/material';
import { useMemo, useState } from 'react';
import { InterviewStatus, Interview, RoundStatus } from '@/api/services/interviewService';
import { useInterviewStore } from '@/state/interview-store';
import { useModalStore } from '@/state/dialog-store';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale/zh-CN';
import { clientLogger } from '@/utils/logger';

/**
 * 面试列表组件属性接口
 */
interface InterviewListProps {
  interviewList: Interview[];
}

/**
 * 状态对应的显示配置
 */
const statusConfig: Record<
  InterviewStatus,
  {
    text: string;
    color: string;
    bgColor: string;
  }
> = {
  [InterviewStatus.ONGOING]: { text: '进行中', color: 'info.main', bgColor: 'rgba(33, 150, 243, 0.1)' },
  [InterviewStatus.COMPLETED]: { text: '已通过', color: 'success.main', bgColor: 'rgba(76, 175, 80, 0.1)' },
  [InterviewStatus.FAILED]: {
    text: '未通过',
    color: 'error.main',
    bgColor: 'rgba(244, 67, 54, 0.1)',
  },
};

// 定义在进行中状态下，左侧色条的颜色顺序
const colorSequence = ['secondary.main', 'primary.main', 'warning.main', 'info.main', 'error.main'];

/**
 * 单个面试项组件
 */
interface InterviewItemProps {
  interview: Interview;
  index: number;
  onClick: (interview: Interview) => void;
  isLastItem?: boolean;
}

function InterviewItem({ interview, index, onClick, isLastItem = false }: InterviewItemProps) {
  // 获取最新的面试轮次
  const latestRound = useMemo(() => {
    if (!interview.rounds || interview.rounds.length === 0) return null;
    
    // 按轮次号排序，取最大的
    return interview.rounds.sort((a, b) => b.roundNumber - a.roundNumber)[0];
  }, [interview]);

  // 格式化日期
  const formattedDate = useMemo(() => {
    if (!latestRound?.scheduledTime) return '';

    try {
      // 尝试判断scheduledTime格式
      let dateObj;
      const scheduledTime = latestRound.scheduledTime;

      if (Array.isArray(scheduledTime) && scheduledTime.length >= 3) {
        // 处理数组格式 [year, month, day, hour, minute, second]
        // Date 构造函数中月份参数是 0-indexed
        dateObj = new Date(
          scheduledTime[0],      // year
          scheduledTime[1] - 1,  // month (0-indexed)
          scheduledTime[2],      // day
          scheduledTime[3] || 0, // hour (optional)
          scheduledTime[4] || 0, // minute (optional)
          scheduledTime[5] || 0  // second (optional)
        );
      } else if (/^\d{10,}$/.test(scheduledTime.toString())) {
        // 如果是纯数字且长度大于等于10，可能是时间戳
        const timestamp = parseInt(scheduledTime.toString());
        dateObj = new Date(timestamp);
      } else {
        // 否则尝试标准日期格式解析
        dateObj = new Date(scheduledTime);
      }

      // 检查日期是否有效
      if (isNaN(dateObj.getTime())) {
        throw new Error('无效日期');
      }

      return format(dateObj, 'yyyy/MM/dd', { locale: zhCN });
    } catch (error) {
      clientLogger.error('日期格式化错误', { scheduledTime: latestRound.scheduledTime, error });
      // 显示原始格式但尝试格式化
      if (typeof latestRound.scheduledTime === 'string' && latestRound.scheduledTime.length > 8) {
        try {
          // 尝试格式化纯数字字符串
          if (/^\d+$/.test(latestRound.scheduledTime)) {
            // 简化处理，只要是数字串就尝试格式化前8位为日期
            return `${latestRound.scheduledTime.slice(0,4)}/${latestRound.scheduledTime.slice(4,6)}/${latestRound.scheduledTime.slice(6,8)}`;
          }
        } catch (e) {
          // 格式化失败，返回原样
        }
      }
      return latestRound.scheduledTime?.toString() || '';
    }
  }, [latestRound]);

  return (
    <>
      <Box
        onClick={() => onClick(interview)}
        sx={{
          cursor: 'pointer',
          bgcolor: 'background.paper',
          height: isLastItem ? '81px' : '61px',
          width: '100%',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Stack direction="row" spacing={1.5}>
          {/* 左侧色条 */}
          <Box
            sx={{
              width: '4px',
              height: '62px',
              bgcolor:
                interview.status === InterviewStatus.ONGOING
                  ? colorSequence[index % colorSequence.length]
                  : statusConfig[interview.status].color,
            }}
          />

          {/* 主要内容：左侧信息和右侧时间 */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
            }}
          >
            {/* 左侧：公司和职位信息 */}
            <Box>
              {/* 公司名称和轮次 */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {interview.company}
                </Typography>

                {interview.status === InterviewStatus.ONGOING && latestRound && (
                  <Box
                    sx={{
                      px: 1,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: 1,
                      display: 'flex',
                    }}
                  >
                    <Typography variant="body2" color="info.main">
                      {latestRound.roundNumber === 1 ? '一面' : 
                       latestRound.roundNumber === 2 ? '二面' : 
                       latestRound.roundNumber === 3 ? '三面' : 
                       `${latestRound.roundNumber}面`}
                    </Typography>
                  </Box>
                )}

                {interview.status !== InterviewStatus.ONGOING && (
                  <Box
                    sx={{
                      ml: 0.5,
                      px: 1,
                      bgcolor: statusConfig[interview.status].bgColor,
                      borderRadius: 1,
                      display: 'flex',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={statusConfig[interview.status].color}
                    >
                      {statusConfig[interview.status].text}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {/* 职位名称 */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: '260px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {interview.position}
              </Typography>
            </Box>

            {/* 右侧：面试时间 */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                mr: 2,
              }}
            >
              {latestRound && (
                <Typography variant="body2" color="info.main">
                  {formattedDate}
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
      {!isLastItem && <Divider sx={{ ml: '6px' }} />}
    </>
  );
}

/**
 * 面试列表组件
 *
 * 显示分状态的面试列表，支持按不同状态切换查看
 *
 * @param {InterviewListProps} props - 组件属性
 * @returns {JSX.Element} 面试列表组件
 */
export default function InterviewList({ interviewList }: InterviewListProps) {
  const { setCurrentInterview } = useInterviewStore();
  const { openInterviewAgendaDetailDialog } = useModalStore();
  
  // 按状态分组面试
  const groupedInterviews = useMemo(() => {
    const grouped = {
      [InterviewStatus.ONGOING]: [] as Interview[],
      [InterviewStatus.COMPLETED]: [] as Interview[],
      [InterviewStatus.FAILED]: [] as Interview[],
    };
    
    interviewList.forEach(interview => {
      grouped[interview.status].push(interview);
    });
    
    return grouped;
  }, [interviewList]);

  // 处理点击面试项
  const handleInterviewClick = (interview: Interview) => {
    setCurrentInterview(interview);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        mt: 2,
      }}
    >
      {/* 面试列表头部 */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          面试日程
        </Typography>
      </Box>
      
      <Divider />
      
      {/* 面试列表内容 */}
      <Box sx={{ p: 2, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {/* 进行中的面试 */}
        {groupedInterviews[InterviewStatus.ONGOING].length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
              进行中
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {groupedInterviews[InterviewStatus.ONGOING].map((interview, index) => (
                <InterviewItem
                  key={interview.id}
                  interview={interview}
                  index={index}
                  onClick={handleInterviewClick}
                  isLastItem={index === groupedInterviews[InterviewStatus.ONGOING].length - 1}
                />
              ))}
            </Paper>
          </Box>
        )}
        
        {/* 已通过的面试 */}
        {groupedInterviews[InterviewStatus.COMPLETED].length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
              已通过
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {groupedInterviews[InterviewStatus.COMPLETED].map((interview, index) => (
                <InterviewItem
                  key={interview.id}
                  interview={interview}
                  index={index}
                  onClick={handleInterviewClick}
                  isLastItem={index === groupedInterviews[InterviewStatus.COMPLETED].length - 1}
                />
              ))}
            </Paper>
          </Box>
        )}
        
        {/* 未通过的面试 */}
        {groupedInterviews[InterviewStatus.FAILED].length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, ml: 1 }}>
              未通过
            </Typography>
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {groupedInterviews[InterviewStatus.FAILED].map((interview, index) => (
                <InterviewItem
                  key={interview.id}
                  interview={interview}
                  index={index}
                  onClick={handleInterviewClick}
                  isLastItem={index === groupedInterviews[InterviewStatus.FAILED].length - 1}
                />
              ))}
            </Paper>
          </Box>
        )}
        
        {/* 没有面试数据时显示提示 */}
        {interviewList.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            height: '200px'
          }}>
            <Typography variant="body1" color="text.secondary">
              你还没有面试日程
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              点击"新建面试"开始准备你的面试吧
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}