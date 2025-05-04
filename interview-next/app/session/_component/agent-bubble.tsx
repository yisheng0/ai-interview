'use client';
import { Box, Link, Typography, useTheme } from '@mui/material';
import * as React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';

/**
 * AI 消息气泡组件属性
 */
interface AIBubbleProps {
  // AI 消息文本内容
  text: string;
  // 是否正在流式响应中
  isStreaming?: boolean;
}

/**
 * AI 消息气泡组件
 * 功能：
 * 1. 展示 AI 回复的消息内容
 * 2. 支持 Markdown 格式渲染
 * 3. 支持流式响应状态展示
 */
export default function AgentBubble({ text, isStreaming }: AIBubbleProps) {
  const theme = useTheme();
  // 自定义 Markdown 组件映射配置
  const MarkdownComponents: Components = {
    // 段落渲染组件
    p: ({ children, ...props }) => {
      // 检查段落中是否包含代码块，避免额外的段落边距
      const hasCodeChild = React.Children.toArray(children).some(
        child =>
          React.isValidElement(child) &&
          ((child.type === 'code' && !(child.props as { inline?: boolean }).inline) ||
            child.type === 'pre')
      );

      if (hasCodeChild) {
        return <Box {...props}>{children}</Box>;
      }

      return (
        <Typography
          component="p"
          variant="body1"
          gutterBottom
          sx={{ fontSize: '21px', lineHeight: 1.6, color: theme => theme.palette.text.primary, mb: 2 }}
          {...props}
        >
          {children}
        </Typography>
      );
    },

    // Markdown 标题渲染配置
    h1: ({ children, ...props }) => (
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontSize: '28px', fontWeight: 600, mb: 2 }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h2: ({ children, ...props }) => (
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: '26px', fontWeight: 600, mb: 2 }}
        {...props}
      >
        {children}
      </Typography>
    ),
    h3: ({ children, ...props }) => (
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: '24px', fontWeight: 600, mb: 2 }}
        {...props}
      >
        {children}
      </Typography>
    ),
    // 链接渲染组件
    a: ({ href, children, ...props }) => (
      <Link href={href} color={theme.palette.info.main} {...props}>
        {children}
      </Link>
    ),

    // 无序列表渲染组件
    ul: ({ children, ...props }) => (
      <Box
        component="ul"
        sx={{
          pl: 3,
          my: 1.5,
          listStyleType: 'disc',
          '& li': {
            display: 'list-item',
            mb: 1,
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 有序列表渲染组件
    ol: ({ children, ...props }) => (
      <Box
        component="ol"
        sx={{
          pl: 3,
          my: 1.5,
          listStyleType: 'decimal',
          listStylePosition: 'outside',
          '& li': {
            display: 'list-item',
            pl: 1,
            mb: 1,
          },
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 列表项渲染组件
    li: ({ children, ...props }) => (
      <Box
        component="li"
        sx={{
          my: 0.8,
          display: 'list-item',
          '& > span': {
            display: 'inline',
          },
        }}
        {...props}
      >
        <Typography component="span" variant="body1" sx={{ display: 'inline', fontSize: '21px' }}>
          {children}
        </Typography>
      </Box>
    ),

    // 加粗文本渲染组件
    strong: ({ children, ...props }) => (
      <Typography
        variant="h4"
        component="strong"
        color="secondary.main"
        sx={{
          display: 'inline',
          fontWeight: 700,
          fontSize: '22px',
        }}
        {...props}
      >
        {children}
      </Typography>
    ),

    // 代码块渲染组件
    pre: ({ children, ...props }) => (
      <Box
        component="pre"
        sx={{
          width: '100%',
          overflow: 'auto',
          backgroundColor: theme => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
          borderRadius: '6px',
          p: 2,
          my: 2,
          border: theme => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]}`,
          fontFamily: 'monospace',
          fontSize: '18px',
          lineHeight: 1.5,
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // 行内代码渲染组件
    code: ({
      inline,
      children,
      ...props
    }: {
      inline?: boolean;
      children?: React.ReactNode;
      className?: string;
    }) => {
      // 根据是否为行内代码使用不同的样式
      if (inline) {
        return (
          <Typography
            component="span"
            sx={{
              backgroundColor: theme => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
              padding: '2px 4px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '20px',
            }}
            {...props}
          >
            {children}
          </Typography>
        );
      }
      return <code {...props}>{children}</code>;
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* 使用 ReactMarkdown 渲染消息内容 */}
      <ReactMarkdown disallowedElements={['img', 'a']} components={MarkdownComponents}>
        {text}
      </ReactMarkdown>
    </Box>
  );
}