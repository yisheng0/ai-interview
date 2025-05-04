'use client';

import { Box, Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnalysisResponsePanel from './_component/analysis-response-panel';
import ConversationHistoryPanel from './_component/conversation-history-panel';
import QuestionPanel from './_component/question-panel';
import ScreenPermissionDialog from './_component/screen-permission-dialog';
import SessionHeader from './_component/session-header';
import SessionLayout from './_component/session-layout';

/**
 * 会话模块属性接口
 */
interface InterviewSessionClientModuleProps {
  /**
   * 面试会话ID
   */
  sessionUuid: string;
  /**
   * 面试会话计费ID
   */
  sessionBillingUuid: string;
}

/**
 * 页面状态枚举
 */
enum UIState {
  /**
   * 初始状态
   */
  INITIAL = 'initial',
  /**
   * 识别中状态
   */
  RECOGNIZING = 'recognizing',
  /**
   * 分析中状态
   */
  PROCESSING = 'processing',
}

/**
 * 面试会话客户端模块
 * 简化版本 - 仅保留UI结构，移除复杂功能
 */
export default function InterviewSessionClientModule({
  sessionUuid,
  sessionBillingUuid,
}: InterviewSessionClientModuleProps) {
  const router = useRouter();

  // ==================== 状态管理 ====================
  
  // 全局UI状态
  const [uiState, setUIState] = useState<UIState>(UIState.INITIAL);
  
  // 屏幕录制相关状态
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [showPermissionSnackbar, setShowPermissionSnackbar] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  
  // 语音识别相关状态（简化）
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');

  /**
   * 检测操作系统类型
   */
  const detectOS = () => {
    return navigator.userAgent.indexOf('Mac') !== -1;
  };

  /**
   * 处理权限对话框确认
   * 模拟开始语音识别和屏幕共享
   */
  const handlePermissionConfirm = () => {
    // 重置错误状态
    setShowPermissionError(false);
    
    // 隐藏对话框并切换到识别状态
    setShowPermissionDialog(false);
    setUIState(UIState.RECOGNIZING);
    
    // 模拟收到问题（3秒后）
    setTimeout(() => {
      setCurrentQuestion('请介绍一下你的项目经验和技术栈');
      setUIState(UIState.PROCESSING);
      
      // 模拟分析响应（1秒后）
      setTimeout(() => {
        setAnalysisResponse('回答思路：先简要概述整体经验，然后详细介绍1-2个重要项目，突出技术难点和解决方案，最后总结技术栈的广度和深度。');
        
        // 模拟AI回答（2秒后）
        setTimeout(() => {
          setAiResponse(`我主要参与过三个大型项目：一个电商平台、一个企业内部管理系统和一个在线教育平台。

在电商平台项目中，我负责了前端架构搭建和核心购物流程开发。使用React+TypeScript构建了组件库，实现了高复用性和可维护性。解决了大量商品数据渲染性能问题，通过虚拟滚动和懒加载技术，使页面加载速度提升了40%。

技术栈方面，前端主要使用React、TypeScript、Next.js、Material UI；后端经验包括Node.js和Express；数据库使用过MongoDB和MySQL；还熟悉Docker容器化和CI/CD流程。`);
        }, 2000);
      }, 1000);
    }, 3000);
  };

  /**
   * 处理Snackbar关闭
   */
  const handleSnackbarClose = () => {
    setShowPermissionSnackbar(false);
  };

  /**
   * 处理退出面试
   */
  const handleExitInterview = () => {
    // 返回主页面
    router.push('/');
  };

  // 组件生命周期
  useEffect(() => {
    // 检测系统类型
    const isMac = detectOS();
    setIsMacOS(isMac);
    
    // 显示权限对话框
    setShowPermissionDialog(true);
    
    // 注意：此处不需要清理，因为没有实际的语音识别服务
  }, []);

  // 示例历史消息数据
  const exampleHistory = [
    { 
      role: 'user', 
      content: '请你先做个自我介绍吧'
    },
    { 
      role: 'assistant', 
      content: '面试官您好，我的名字叫张三。我是一名前端开发工程师，有5年的工作经验。'
    }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        bgcolor: theme => theme.palette.background.default,
      }}
    >
      {/* 权限对话框 */}
      <ScreenPermissionDialog
        open={showPermissionDialog}
        isMacOS={isMacOS}
        showPermissionError={showPermissionError}
        onConfirm={handlePermissionConfirm}
        onCancel={handleExitInterview}
        onClose={() => setShowPermissionDialog(false)}
      />

      {/* 权限提示Snackbar */}
      <Snackbar
        open={showPermissionSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{
            width: '100%',
            bgcolor: theme => theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#fffcf1',
          }}
        >
          请按照以下步骤授予系统音频权限
        </Alert>
      </Snackbar>

      {/* 顶部导航栏 */}
      <SessionHeader
        timerText="00:10:15"
        onBackClick={() => console.log('返回按钮被点击')}
        onEndInterviewClick={handleExitInterview}
      />

      {/* 主内容三栏布局 */}
      <SessionLayout>
        {/* 左侧面试问题区域 */}
        <QuestionPanel
          question={currentQuestion}
          placeholder="面试官问题将被自动识别，并显示在此处"
          isRecognizing={uiState === UIState.RECOGNIZING}
        />

        {/* 中间分析和AI回答区域 */}
        <AnalysisResponsePanel
          analysisContent={analysisResponse}
          responseContent={aiResponse}
          isLoading={uiState === UIState.PROCESSING && !aiResponse}
          analysisPlaceholder="此处将显示面试问题的回答思路供参考"
          responsePlaceholder="此处将显示AI的实时回答"
        />

        {/* 右侧对话历史区域 */}
        <ConversationHistoryPanel 
          history={exampleHistory} 
          placeholder="此处将显示对话记录"
        />
      </SessionLayout>
    </Box>
  );
}