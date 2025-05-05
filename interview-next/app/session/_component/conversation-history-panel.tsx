'use client';

import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import ChatHistoryCard from './chat-history-card';

/**
 * 消息类型
 */
interface Message {
  // 消息发送者角色
  role: 'system' | 'user' | 'assistant';
  // 消息内容
  content: string;
}

/**
 * 对话历史面板组件属性
 */
interface ConversationHistoryPanelProps {
  // 历史消息数组
  history: Message[];
  // 占位文本，当没有历史记录时显示
  placeholder?: string;
}

/**
 * 对话历史面板组件
 *
 * 显示面试对话的历史记录
 */
export default function ConversationHistoryPanel({
  history,
  placeholder = '此处将显示对话记录',
}: ConversationHistoryPanelProps) {
  const hasHistory = history && history.length > 0;

  return (
    <Box
      sx={{
        width: '19%',
        height: '100%',
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
          src="/svg/interview-message.svg"
          alt="历史图标"
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
          对话历史
        </Typography>
      </Box>

      <Divider sx={{ margin: '12px 0' }} />

      {/* 对话历史区域 */}
      <Box sx={{ width: '100%' }}>
        {/* 示例对话卡片 */}
        {/* <ChatHistoryCard
          userQuestion="请你先做个自我介绍吧请你先做个自我介绍吧请你先做个自我介绍吧请你先做个自我介绍吧"
          aiResponse="面试官您好，我的名字叫XXX。"
        /> */}
      </Box>
    </Box>
  );
}