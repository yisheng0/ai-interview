'use client';

import { Box, Alert, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import AnalysisResponsePanel from './_component/analysis-response-panel';
import ConversationHistoryPanel from './_component/conversation-history-panel';
import QuestionPanel from './_component/question-panel';
import ScreenPermissionDialog from './_component/screen-permission-dialog';
import SessionHeader from './_component/session-header';
import SessionLayout from './_component/session-layout';
import { useXfyunSpeech, RecognitionStatus } from '@/utils/xfyun-speech';
import { clientLogger } from '@/utils/logger';
import { useChatStore } from '@/state';
import { createSession, sendMessage, saveConversation, createStreamingConnection } from '@/api/services/aiService';
import { Typography } from '@mui/material';
import AgentBubble from './_component/agent-bubble';

/**
 * 会话模块属性接口
 */
interface InterviewSessionClientModuleProps {
  /**
   * 面试会话ID
   */
  sessionUuid: string;
  /**
   * 面试ID
   */
  interviewId?: string;
  /**
   * 轮次ID
   */
  roundId?: string;
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
 * 对话消息类型
 */
interface ChatMessage {
  /**
   * 消息角色：用户、助手或系统
   */
  role: 'user' | 'assistant' | 'system';
  /**
   * 消息内容
   */
  content: string;
  /**
   * 消息时间戳
   */
  timestamp?: number;
}

/**
 * 面试会话客户端模块
 */
export default function InterviewSessionClientModule({
  sessionUuid,
  interviewId,
  roundId
}: InterviewSessionClientModuleProps) {
  const router = useRouter();
  
  // 使用聊天状态
  const { 
    setSessionId, 
    sessionId,
    hasActiveSession,
    messages, 
    addUserMessage, 
    addAssistantMessage,
    getAllMessages,
    clearMessages
  } = useChatStore();

  // ==================== 状态管理 ====================
  
  // 全局UI状态
  const [uiState, setUIState] = useState<UIState>(UIState.INITIAL);
  
  // 屏幕录制相关状态
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showPermissionError, setShowPermissionError] = useState(false);
  const [showPermissionSnackbar, setShowPermissionSnackbar] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);
  
  // 语音识别相关状态
  const [currentQuestion, setCurrentQuestion] = useState('');   // 当前确认的问题（处理中或已处理）
  const [interimText, setInterimText] = useState('');          // 临时识别文本（尚未处理）
  const [aiResponse, setAiResponse] = useState('');            // AI回复内容
  const [analysisResponse, setAnalysisResponse] = useState(''); // 分析回复内容
  
  // 会话创建状态
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  
  // ==================== Refs ====================
  
  // 静音检测和定时器引用
  const lastVoiceActivityRef = useRef<number>(Date.now());
  const textUpdateTimeRef = useRef<number>(Date.now());
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 请求状态标记
  const isProcessingRef = useRef<boolean>(false);
  const recognizedTextRef = useRef<string>('');
  const processingQuestionRef = useRef<string>('');
  
  // 流式响应取消函数
  const streamCancelRef = useRef<(() => void) | null>(null);
  
  // 使用讯飞语音识别Hook
  const { 
    status, 
    transcript, 
    interimTranscript, 
    error, 
    startRecognition, 
    stopRecognition,
    resetTranscript
  } = useXfyunSpeech({
    appId: '92cf58a0',  // 替换为实际的讯飞应用ID
    apiKey: '44c89beb002a2048b5fd70c3d1a0b7a1',  // 替换为实际的讯飞API密钥
    lang: 'cn'
  });
  
  // 新增的isAiStreaming状态
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  
  /**
   * 检测操作系统类型
   */
  const detectOS = () => {
    return navigator.userAgent.indexOf('Mac') !== -1;
  };
  
  /**
   * 创建面试会话
   * 当没有传入会话ID时，创建新的会话
   */
  const createInterviewSession = async (interviewId: string, roundId: string) => {
    try {
      setIsCreatingSession(true);
      setSessionError(null);
      
      // 调用创建会话API
      const response = await createSession(interviewId, roundId);
      
      if (response.code === 200 && response.data) {
        // 保存会话ID到全局状态
        setSessionId(response.data.sessionId);
        clientLogger.info('创建会话成功，ID:', response.data.sessionId);
        return response.data.sessionId;
      } else {
        throw new Error(response.message || '创建会话失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建会话失败，请重试';
      clientLogger.error('创建会话错误:', error);
      setSessionError(errorMessage);
      return null;
    } finally {
      setIsCreatingSession(false);
    }
  };
  
  /**
   * 启动静音检测
   * 当检测到连续1000ms无声音，且有存在未上报的面试问题的时候，发起一次问题上报请求
   */
  const startSilenceDetection = () => {
    // 清除之前的定时器
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // 设置初始检测时间
    const initTime = Date.now();
    lastVoiceActivityRef.current = initTime;
    textUpdateTimeRef.current = initTime;
    
    clientLogger.info('【静音检测】启动静音检测，初始时间：', initTime);
    
    // 创建新的定时器，简化逻辑，确保可靠检测
    silenceTimerRef.current = setInterval(() => {
      // 当前时间
      const now = Date.now();
      
      // 计算静音时间
      const silenceTime = now - lastVoiceActivityRef.current;
      
      // 检查是否有识别文本
      const recognizedText = recognizedTextRef.current.trim();
      const hasText = recognizedText.length > 0;
      
      // 输出详细日志用于排查
      if (hasText) {
        clientLogger.info('【静音检测】状态检查:', {
          silenceTime,
          hasText,
          isProcessing: isProcessingRef.current,
          uiState,
          recognizedText: recognizedText.length > 30 ? 
            recognizedText.substring(0, 30) + '...' : 
            recognizedText
        });
      }
      
      // 如果有文本且满足触发条件，发起请求
      if (hasText && 
          !isProcessingRef.current && 
          (uiState === UIState.RECOGNIZING || uiState === UIState.INITIAL) && 
          silenceTime >= 1000) {
        
        clientLogger.info(`【静音检测】触发AI请求，静音时间: ${silenceTime}，问题: ${recognizedText}，当前状态: ${uiState}`);
        
        // 立即停止检测避免重复触发
        if (silenceTimerRef.current) {
          clearInterval(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        
        // 触发AI请求
        setProcessingState(recognizedText);
      }
    }, 500); // 增加间隔到500毫秒，减少检测频率提高稳定性
  };
  
  /**
   * 设置页面为识别状态
   */
  const setRecognizingState = () => {
    // 设置UI状态为识别中
    setUIState(UIState.RECOGNIZING);
    
    // 当识别到新的面试官音频时，清空面试问题区
    if (uiState === UIState.PROCESSING) {
      setInterimText('');
      recognizedTextRef.current = '';
    }
    
    // 不再自动清空AI回复和分析结果，保持显示上一次的回复
    // setAiResponse('');
    // setAnalysisResponse('');
    
    // 重置处理标记
    isProcessingRef.current = false;
    
    // 重新启动静音检测
    startSilenceDetection();
    
    clientLogger.info('已切换到识别状态');
  };
  
  /**
   * 设置页面为处理状态
   * @param question 识别到的问题
   */
  const setProcessingState = (question: string) => {
    // 确保问题有内容
    if (!question || !question.trim()) {
      clientLogger.info('问题为空，不处理');
      return;
    }
    
    // 防止重复处理相同的问题
    if (isProcessingRef.current) {
      clientLogger.info('已在处理中，跳过请求');
      return;
    }
    
    if (processingQuestionRef.current === question) {
      clientLogger.info('相同问题已处理，跳过');
      return;
    }
    
    clientLogger.info('【重要】开始处理问题：', question);
    
    // 设置处理中标记
    isProcessingRef.current = true;
    processingQuestionRef.current = question;
    
    // 停止当前的静音检测
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // 设置UI状态为处理中
    setUIState(UIState.PROCESSING);
    
    // 保存当前问题
    setCurrentQuestion(question);
    
    // 重置AI回复和分析，显示加载中状态
    setAiResponse('');
    setAnalysisResponse('');
    
    clientLogger.info('已切换到处理状态，问题：', question);
    
    // 调用AI接口获取回复
    fetchAIResponse(question);
  };
  
  /**
   * 获取AI回复
   * @param userInput 用户输入的问题
   */
  const fetchAIResponse = async (userInput: string) => {
    // 如果没有内容，不做处理
    if (!userInput.trim()) {
      isProcessingRef.current = false;
      setRecognizingState();
      return;
    }
    
    // 确保有会话ID
    if (!sessionId) {
      clientLogger.error('获取AI回复失败: 没有有效的会话ID');
      setAnalysisResponse('连接错误，请重新进入面试');
      setAiResponse('连接错误，请重新进入面试');
      isProcessingRef.current = false;
      return;
    }
    
    try {
      clientLogger.info('请求AI回复，问题：', userInput);
      
      // 添加用户消息到聊天历史
      addUserMessage(userInput);
      
      // 取消之前的流式连接
      if (streamCancelRef.current) {
        streamCancelRef.current();
        streamCancelRef.current = null;
      }
      
      // 明确设置为处理中状态
      setUIState(UIState.PROCESSING);
      
      // 预设初始状态
      setAiResponse('');
      setAnalysisResponse('');
      
      // 启用流式响应状态
      setIsAiStreaming(true);
      
      // 同时发起两个请求（并发处理）
      let fullResponse = '';
      
      // 问题分析请求（非流式）
      const analysisPromise = sendMessage(sessionId, userInput)
        .then(response => {
          if (response.code === 200 && response.data) {
            // 更新分析回复
            const analysisText = response.data.reply.substring(0, 50); // 限制分析长度在50字以内
            setAnalysisResponse(analysisText);
          } else {
            // 请求成功但业务错误
            clientLogger.warn('分析请求返回非成功状态:', response);
            setAnalysisResponse('分析生成中...');
          }
        })
        .catch(analysisError => {
          // 分析请求失败记录错误
          clientLogger.error('获取分析失败:', analysisError);
          setAnalysisResponse('分析生成中...');
        });
      
      // AI回答请求（流式）
      const streamingPromise = new Promise<void>((resolve, reject) => {
        // 创建新的流式连接
        streamCancelRef.current = createStreamingConnection(
          sessionId,
          userInput,
          // 处理数据块
          (chunk) => {
            // 确保组件仍然在流式状态
            setIsAiStreaming(true);
            
            // 更新完整响应
            fullResponse += chunk;
            
            // 更新UI显示
            setAiResponse(prev => {
              // 使用函数式更新确保获取最新状态
              return prev + chunk;
            });
          },
          // 完成回调
          () => {
            clientLogger.info('流式响应完成');
            // 添加AI回复到聊天历史
            addAssistantMessage(fullResponse);
            // 禁用流式响应状态
            setIsAiStreaming(false);
            streamCancelRef.current = null;
            resolve();
          },
          // 错误回调
          (error) => {
            clientLogger.error('流式请求错误:', error);
            setAiResponse(fullResponse || '回答生成出错，请重试');
            // 禁用流式响应状态
            setIsAiStreaming(false);
            
            // 如果有部分回复，也添加到历史
            if (fullResponse) {
              addAssistantMessage(fullResponse);
            }
            
            streamCancelRef.current = null;
            reject(error);
          }
        );
      });
      
      // 并发执行两个请求，但不阻塞等待完成
      Promise.all([analysisPromise, streamingPromise])
        .catch(error => {
          clientLogger.error('并发请求出错:', error);
        });
        
    } catch (error) {
      clientLogger.error('获取AI回复失败:', error);
      // 显示错误信息
      setAnalysisResponse('获取分析失败，请重试');
      setAiResponse('回答生成失败，请重试');
      // 禁用流式响应状态
      setIsAiStreaming(false);
    } finally {
      // 处理完成后重置状态
      isProcessingRef.current = false;
      
      // 清空识别的文本，准备接收新问题
      recognizedTextRef.current = '';
      
      // 启动静音检测，等待下次语音活动
      startSilenceDetection();
      
      clientLogger.info('AI回复已完成，等待下次语音活动');
    }
  };
  
  /**
   * 处理权限对话框确认
   */
  const handlePermissionConfirm = async () => {
    // 隐藏对话框
    setShowPermissionDialog(false);
    
    try {
      // 开始录音和识别
      clientLogger.info('尝试启动语音识别...');
      await startRecognition();
      
      // 更新UI状态 - 直接设置状态而不是调用函数
      setUIState(UIState.RECOGNIZING);
      
      // 重置处理标记
      isProcessingRef.current = false;
      
      // 启动静音检测
      startSilenceDetection();
      
      clientLogger.info(`语音识别已启动成功，当前UI状态: ${UIState.RECOGNIZING}`);
    } catch (err) {
      clientLogger.error('启动语音识别失败:', err);
      setShowPermissionError(true);
      setShowPermissionDialog(true);
      setShowPermissionSnackbar(true);
    }
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
  const handleExitInterview = async () => {
    try {
      // 停止录音和识别
      clientLogger.info('停止语音识别');
      stopRecognition();
      
      // 清除定时器
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
      }
      
      // 取消流式连接
      if (streamCancelRef.current) {
        streamCancelRef.current();
      }
      
      // 保存对话历史
      if (sessionId && messages.length > 0) {
        clientLogger.info('保存对话历史');
        await saveConversation(sessionId, messages);
      }
      
      // 清空会话状态
      clearMessages();
    } catch (error) {
      clientLogger.error('退出面试时出错:', error);
    } finally {
      // 返回主页面
      router.push('/agenda');
    }
  };
  
  // ==================== 效果钩子 ====================
  
  // 会话初始化 - 在组件挂载时执行
  useEffect(() => {
    const initSession = async () => {
      // 如果已经有活跃会话，不需要创建
      if (hasActiveSession) {
        clientLogger.info('已有活跃会话，无需创建');
        return;
      }
      // 传入的sessionUuid优先使用
      if (sessionUuid) {
        clientLogger.info('使用传入的会话ID:', sessionUuid);
        setSessionId(sessionUuid);
      } else {
        // 无会话ID，需要创建新会话，优先用props传入的interviewId和roundId
        clientLogger.info('没有会话ID，创建新会话', { interviewId, roundId });
        const newSessionId = await createInterviewSession(interviewId, roundId);
        if (!newSessionId) {
          clientLogger.error('创建会话失败');
          // 这里可以显示错误提示或者重定向
        }
      }
    };
    initSession();
  }, [sessionUuid, hasActiveSession, setSessionId, interviewId, roundId]);
  
  // 监听语音识别状态变化
  useEffect(() => {
    clientLogger.debug('语音识别状态变化:', { status });
    
    // 处理识别错误
    if (status === RecognitionStatus.ERROR && error) {
      clientLogger.error('语音识别错误:', error);
      setShowPermissionError(true);
      setShowPermissionDialog(true);
      setShowPermissionSnackbar(true);
    }
  }, [status, error]);
  
  // 处理临时识别结果
  useEffect(() => {
    // 如果没有临时识别结果或者当前在处理中，不处理
    if (!interimTranscript || isProcessingRef.current || uiState === UIState.PROCESSING) {
      return;
    }
    
    // 每次收到临时识别结果，记录活动时间
    const now = Date.now();
    lastVoiceActivityRef.current = now;
    textUpdateTimeRef.current = now;
    
    clientLogger.info(`【语音活动】检测到语音活动，更新时间: ${now}`);
    
    // 更新识别的文本
    recognizedTextRef.current = interimTranscript;
    
    // 更新UI显示文本
    setInterimText(interimTranscript);
    
    // 如果不在识别状态，直接设置为识别状态
    if (uiState !== UIState.RECOGNIZING) {
      clientLogger.info(`【状态切换】从 ${uiState} 切换到 ${UIState.RECOGNIZING}`);
      setUIState(UIState.RECOGNIZING);
      
      // 重置处理标记
      isProcessingRef.current = false;
    }
    
    // 确保静音检测在运行
    if (!silenceTimerRef.current) {
      startSilenceDetection();
    }
  }, [interimTranscript, uiState]);
  
  // 处理最终识别结果
  useEffect(() => {
    if (!transcript || isProcessingRef.current || uiState === UIState.PROCESSING) {
      return;
    }
    
    clientLogger.info('接收到最终识别结果:', transcript);
    
    // 每次收到最终识别结果，记录活动时间
    const now = Date.now();
    lastVoiceActivityRef.current = now;
    textUpdateTimeRef.current = now;
    
    clientLogger.info(`【语音活动】接收到最终结果，更新活动时间: ${now}`);
    
    // 拼接最终识别结果
    const prevText = recognizedTextRef.current;
    const updatedText = prevText ? `${prevText} ${transcript}` : transcript;
    recognizedTextRef.current = updatedText;
    
    // 更新UI显示
    setInterimText(updatedText);
    
    // 重置transcript，避免重复处理
    resetTranscript();
  }, [transcript, uiState, resetTranscript]);
  
  // 组件挂载和卸载
  useEffect(() => {
    // 检测系统类型
    const isMac = detectOS();
    setIsMacOS(isMac);
    
    // 显示权限对话框
    setShowPermissionDialog(true);
    
    // 组件卸载时清理资源
    return () => {
      stopRecognition();
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
      }
      
      // 取消流式连接
      if (streamCancelRef.current) {
        streamCancelRef.current();
      }
    };
  }, []);
  
  // ==================== 渲染逻辑 ====================
  
  /**
   * 获取要显示的问题文本
   * 当处理中时显示当前确认的问题，否则显示实时识别的文本
   */
  const displayQuestion = uiState === UIState.PROCESSING ? currentQuestion : interimText;
  
  /**
   * 获取分析面板内容
   */
  const getAnalysisContent = () => {
    if (uiState === UIState.INITIAL && !analysisResponse) {
      return '此处将显示面试问题的回答思路供参考';
    } else if (uiState === UIState.PROCESSING && !analysisResponse) {
      return '正在生成中，请稍后...';
    }
    return analysisResponse || '此处将显示面试问题的回答思路供参考';
  };
  
  /**
   * 获取AI回复内容
   */
  const getResponseContent = () => {
    // 根据不同状态返回不同内容
    if (uiState === UIState.INITIAL && !aiResponse) {
      // 初始状态且没有AI回复
      return <Typography variant="body1">AI将在这里提供答案提示</Typography>;
    } else if (uiState === UIState.PROCESSING && !aiResponse) {
      // 处理中且没有AI回复 - 显示加载状态
      return <Typography variant="body1">AI正在思考中...</Typography>;
    } else if (aiResponse) {
      // 有AI回复，使用AgentBubble显示并传递流式状态
      return <AgentBubble text={aiResponse} isStreaming={isAiStreaming} />;
    } else {
      // 其他情况
      return <Typography variant="body1">AI将在这里提供答案提示</Typography>;
    }
  };
  
  /**
   * 获取问题面板提示文本
   */
  const getQuestionPlaceholder = () => {
    if (uiState === UIState.INITIAL) {
      return '面试官问题将被自动识别，并显示在此处';
    }
    return '';
  };

  // 如果会话创建出错，显示错误提示
  if (sessionError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f1fafe',
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {sessionError}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <button
            onClick={() => router.push('/agenda')}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            返回日程页
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        bgcolor: '#f1fafe',
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
            bgcolor: '#fffcf1',
          }}
        >
          请在弹窗中选择"共享系统音频"以允许捕获面试官的声音
        </Alert>
      </Snackbar>

      {/* 顶部导航栏 */}
      <SessionHeader
        onEndInterviewClick={handleExitInterview}
      />

      {/* 主内容三栏布局 */}
      <SessionLayout>
        {/* 左侧面试问题区域 */}
        <QuestionPanel
          question={displayQuestion}
          isRecognizing={uiState === UIState.RECOGNIZING}
          placeholder={getQuestionPlaceholder()}
        />

        {/* 中间分析回答区域 */}
        <AnalysisResponsePanel
          analysisContent={getAnalysisContent()}
          responseContent={getResponseContent()}
          isLoading={uiState === UIState.PROCESSING && !aiResponse}
          isStreaming={isAiStreaming}
        />

        {/* 右侧对话历史区域 */}
        <ConversationHistoryPanel
          // 使用全局状态中的消息历史
          history={messages}
        />
      </SessionLayout>
    </Box>
  );
}