'use client';

import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import { WaveIcon } from './voice-recognition-indicator';

/**
 * 问题面板组件属性
 */
export interface QuestionPanelProps {
  // 面试问题文本
  question: string;
  // 占位文本，当没有问题时显示
  placeholder?: string;
  // 是否正在识别中
  isRecognizing?: boolean;
  // 临时识别结果文本
  interimText?: string;
}

/**
 * 显示当前面试问题和语音识别状态
 */
export default function QuestionPanel({
  question,
  placeholder = '面试官问题将被自动识别，并显示在此处',
  isRecognizing = true,
  interimText = '',
}: QuestionPanelProps) {
  // 判断是否有显示内容
  const hasContent = question && question.trim().length > 0;

  return (
    <Box
      sx={{
        width: '33%',
        height: '100%',
        padding: '16px',
        overflow: 'auto',
        borderRight: '1px solid',
        borderColor: theme => theme.palette.divider,
        bgcolor: theme => theme.palette.background.paper,
        borderRadius: '16px',
      }}
    >
      {/* 标题和语音识别指示器 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
          gap: '10px',
        }}
      >
        <Image
          src="/svg/interview-audio-question.svg"
          alt="问题图标"
          width={26}
          height={26}
          style={{ marginRight: '8px' }}
        />
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            color: theme => theme.palette.text.primary,
            marginRight: '8px',
          }}
        >
          面试问题
        </Typography>

        {/* 语音识别指示器，仅在识别中时显示 */}
        {isRecognizing && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <WaveIcon isAnimating={true} />
            <Typography
              sx={{
                fontSize: '14px',
                color: theme => theme.palette.text.secondary,
              }}
            >
              持续识别语音中
            </Typography>
          </Box>
        )}
      </Box>
      <Divider sx={{ margin: '12px 0' }} />
      {/* 问题内容区域 */}
      <Box
        sx={{
          padding: '16px',
          minHeight: '100px',
        }}
      >
        <Typography
          sx={{
            fontSize: '20px',
            lineHeight: 1.6,
            color: theme => hasContent ? theme.palette.text.primary : theme.palette.text.disabled,
          }}
        >
          {hasContent ? question : placeholder}
        </Typography>
      </Box>
    </Box>
  );
}