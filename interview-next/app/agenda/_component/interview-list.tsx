'use client';

import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

/**
 * 面试列表组件属性接口
 */
interface InterviewListProps {
  interviewList: any[];
}

/**
 * 面试状态枚举
 */
enum InterviewStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  PASS = 'PASS',
  TERMINATE = 'TERMINATE',
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
  [InterviewStatus.IN_PROGRESS]: { text: '进行中', color: '', bgColor: '' },
  [InterviewStatus.PASS]: { text: '已通过', color: 'success.main', bgColor: 'rgba(76, 175, 80, 0.1)' },
  [InterviewStatus.TERMINATE]: {
    text: '已终止',
    color: 'neutral.main',
    bgColor: 'rgba(158, 158, 158, 0.1)',
  },
};

// 定义在进行中状态下，左侧色条的颜色顺序
const colorSequence = ['secondary.main', 'primary.main', 'warning.main', 'info.main', 'error.main'];

/**
 * 单个面试项组件
 */
interface InterviewItemProps {
  item: any;
  index: number;
  status: InterviewStatus;
  onClick: (uuid: string) => void;
  isLastItem?: boolean;
}

function InterviewItem({ item, index, status, onClick, isLastItem = false }: InterviewItemProps) {
  return (
    <>
      <Box
        onClick={() => onClick(item.uuid || '1')}
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
                status === InterviewStatus.IN_PROGRESS
                  ? colorSequence[index % colorSequence.length]
                  : statusConfig[status].color,
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
                  示例公司
                </Typography>

                {status === InterviewStatus.IN_PROGRESS && (
                  <Box
                    sx={{
                      px: 1,
                      bgcolor: 'rgba(33, 150, 243, 0.1)',
                      borderRadius: 1,
                      display: 'flex',
                    }}
                  >
                    <Typography variant="body2" color="info.main">
                      一面
                    </Typography>
                  </Box>
                )}

                {status !== InterviewStatus.IN_PROGRESS && (
                  <Box
                    sx={{
                      ml: 0.5,
                      px: 1,
                      bgcolor: statusConfig[status].bgColor,
                      borderRadius: 1,
                      display: 'flex',
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={
                        status === InterviewStatus.TERMINATE
                          ? 'text.primary'
                          : statusConfig[status].color
                      }
                    >
                      {statusConfig[status].text}
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
                前端开发工程师
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
              <Typography variant="body2" color="info.main">
                7月15日 14:30
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
      {!isLastItem && <Divider sx={{ ml: '6px' }} />}
    </>
  );
}

/**
 * 面试状态区块组件
 */
interface InterviewSectionProps {
  title: string;
  status: InterviewStatus;
  onItemClick: (uuid: string) => void;
}

function InterviewSection({ title, status, onItemClick }: InterviewSectionProps) {
  // 每个状态展示2个示例项目
  return (
    <Box sx={{ mb: 3, bgcolor: 'background.paper', borderRadius: '8px' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="start"
        sx={{ ml: 1, height: '30px' }}
      >
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Stack>
      <InterviewItem
        key={`${status}-1`}
        item={{ uuid: `${status}-1` }}
        index={0}
        status={status}
        onClick={onItemClick}
        isLastItem={false}
      />
      <InterviewItem
        key={`${status}-2`}
        item={{ uuid: `${status}-2` }}
        index={1}
        status={status}
        onClick={onItemClick}
        isLastItem={true}
      />
    </Box>
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
  // 处理点击面试项
  const handleInterviewClick = (uuid: string) => {
    console.log('点击了面试项:', uuid);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: (theme) => theme.palette.background.default,
      }}
    >
      {/* 面试列表 */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* 进行中的面试 */}
        <InterviewSection
          title="进行中"
          status={InterviewStatus.IN_PROGRESS}
          onItemClick={handleInterviewClick}
        />

        {/* 已通过的面试 */}
        <InterviewSection
          title="已通过"
          status={InterviewStatus.PASS}
          onItemClick={handleInterviewClick}
        />

        {/* 已终止的面试 */}
        <InterviewSection
          title="已终止" 
          status={InterviewStatus.TERMINATE}
          onItemClick={handleInterviewClick}
        />
      </Box>
    </Paper>
  );
}