'use client';

import { Box, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import Image from 'next/image';

/**
 * 对话组合卡片组件属性
 */
interface ChatHistoryCardProps {
  // 用户提问内容
  userQuestion: string;
  // AI回答内容
  aiResponse: string;
  // 最大显示行数，超出将截断
  maxLines?: number;
}

/**
 * 自定义浅色背景Tooltip
 * 用于在悬停时显示完整对话内容
 */
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 'none',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.background.paper,
    fontSize: '36px',
    '&:before': {
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
    },
  },
}));

/**
 * 对话历史卡片组件
 * 以卡片形式展示一组对话（用户提问和AI回答）
 */
export default function ChatHistoryCard({
  userQuestion,
  aiResponse,
  maxLines = 4,
}: ChatHistoryCardProps) {
  return (
    <LightTooltip
      placement="left-end"
      arrow
      slotProps={{
        popper: {
          sx: {
            marginRight: '150px',
          },
        },
      }}
      title={
        <Box
          sx={{
            backgroundColor: theme => theme.palette.background.paper,
            borderRadius: '8px',
            padding: '16px',
            width: '612px',
          }}
        >
          {/* 用户提问部分 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
            <Image
              src="/svg/interview-history-user.svg"
              alt="用户提问"
              width={22}
              height={22}
              style={{ marginRight: '8px', marginTop: '4px' }}
            />
            <Box sx={{ width: '100%' }}>
              <Typography
                variant="caption"
                color="primary.light"
                sx={{
                  fontSize: '20px',
                  lineHeight: 1.6,
                  fontWeight: 700,
                  letterSpacing: 0,
                }}
              >
                {userQuestion}
              </Typography>
            </Box>
          </Box>

          {/* AI回答部分 */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Image
              src="/svg/interview-history-ai.svg"
              alt="AI回答"
              width={22}
              height={22}
              style={{ marginRight: '8px', marginTop: '4px' }}
            />
            <Box sx={{ width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontWeight: 400,
                  letterSpacing: 0,
                  lineHeight: '32px',
                  fontFamily: 'Inter',
                }}
              >
                {aiResponse}
                {aiResponse}
                {aiResponse}
              </Typography>
            </Box>
          </Box>
        </Box>
      }
    >
      <Box
        sx={{
          backgroundColor: theme => theme.palette.background.paper,
          border: theme => `1px solid ${theme.palette.divider}`,
          borderRadius: '13px',
          padding: '16px',
          marginBottom: '16px',
          width: '100%',
          height: '232px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
          cursor: 'pointer',
        }}
      >
        {/* 用户提问部分 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
          <Image
            src="/svg/interview-history-user.svg"
            alt="用户提问"
            width={22}
            height={22}
            style={{ marginRight: '8px', marginTop: '4px' }}
          />
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: 1.6,
                fontWeight: 700,
                letterSpacing: 0,
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'black',
              }}
            >
              {userQuestion}
            </Typography>
          </Box>
        </Box>

        {/* AI回答部分 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Image
            src="/svg/interview-history-ai.svg"
            alt="AI回答"
            width={22}
            height={22}
            style={{ marginRight: '8px', marginTop: '4px' }}
          />
          <Box sx={{ width: '100%' }}>
            <Typography
              sx={{
                fontSize: '14px',
                lineHeight: 1.6,
                fontWeight: 400,
                letterSpacing: 0,
                color: theme => theme.palette.text.secondary,
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {aiResponse}
            </Typography>
          </Box>
        </Box>
      </Box>
    </LightTooltip>
  );
}