'use client';

import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import AgentBubble from './agent-bubble';
import LoadingIndicator from './loading-indicator';

/**
 * 分析回答面板组件属性
 */
interface AnalysisResponsePanelProps {
  // 问题分析内容
  analysisContent: string;
  // AI回答内容
  responseContent: string;
  // 是否正在加载
  isLoading?: boolean;
  // 分析区域占位文本
  analysisPlaceholder?: string;
  // 回答区域占位文本
  responsePlaceholder?: string;
}

/**
 * 分析回答面板组件
 *
 * 显示问题分析和AI回答的面板
 */
export default function AnalysisResponsePanel({
  analysisContent,
  responseContent,
  isLoading = false,
  analysisPlaceholder = '此处将显示面试问题的回答思路供参考',
  responsePlaceholder = '此处将显示AI的实时回答',
}: AnalysisResponsePanelProps) {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '17.5px',
      }}
    >
      {/* 问题分析区域 */}
      <Box
        sx={{
          flex: 1,
          padding: '16px',
          overflow: 'auto',
          borderBottom: '1px solid',
          borderColor: theme => theme.palette.divider,
          bgcolor: theme => theme.palette.background.paper,
          borderRadius: '16px',
        }}
      >
        {/* 标题 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <Image
            src="/svg/interview-message.svg"
            alt="问题分析图标"
            width={26}
            height={26}
            style={{ marginRight: '8px' }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme => theme.palette.text.primary,
            }}
          >
            问题分析
          </Typography>
        </Box>
        <Divider sx={{ margin: '8px 0' }} />
        {/* 内容区域 */}
        <Box
          sx={{
            padding: '8px',
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LoadingIndicator />
              <Typography
                sx={{
                  fontSize: '20px',
                  ml: 1,
                  color: theme => theme.palette.text.secondary,
                }}
              >
                {analysisContent}
              </Typography>
            </Box>
          ) : analysisContent ? (
            <Typography
              sx={{
                fontSize: '20px',
                lineHeight: 1.6,
                color: theme => theme.palette.text.primary,
              }}
            >
              {analysisContent}
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: '20px',
                lineHeight: 1.6,
                color: theme => theme.palette.text.disabled,
              }}
            >
              {analysisPlaceholder}
            </Typography>
          )}
        </Box>
      </Box>

      {/* AI答案提示区域 */}
      <Box
        sx={{
          flex: 4.8,
          padding: '16px',
          overflow: 'auto',
          bgcolor: theme => theme.palette.background.paper,
          borderRadius: '16px',
        }}
      >
        {/* 标题 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <Image
            src="/svg/interview-ai.svg"
            alt="AI图标"
            width={26}
            height={26}
            style={{ marginRight: '8px' }}
          />
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: theme => theme.palette.text.primary,
            }}
          >
            AI答案提示
          </Typography>
        </Box>
        <Divider sx={{ margin: '12px 0' }} />
        {/* 内容区域 */}
        <Box
          sx={{
            padding: '16px',
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LoadingIndicator />
              <Typography
                sx={{
                  fontSize: '20px',
                  ml: 1,
                  color: theme => theme.palette.text.secondary,
                }}
              >
                {responseContent}
              </Typography>
            </Box>
          ) : responseContent ? (
            <AgentBubble text={responseContent} />
          ) : (
            <Typography
              sx={{
                fontSize: '20px',
                lineHeight: 1.6,
                color: theme => theme.palette.text.disabled,
              }}
            >
              {responsePlaceholder}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}