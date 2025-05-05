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
 * 模拟请求AI回复
 * @param question 问题文本
 * @returns 模拟的AI回复和分析
 */
const mockAIResponse = async (question: string): Promise<{ response: string; analysis: string }> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 根据问题内容返回不同的模拟回复
  if (question.includes('介绍') || question.includes('自我')) {
    return {
      response: '各位面试官好，我是陈迪，安徽理工大学​​地理空间信息工程​​专业在读本科生，主攻​​前端开发​​方向，熟悉 ​​Vue3​​、​​React​​ 技术栈，有​​小红书​​和​​自动驾驶​​领域的两段中大型项目实战经验。在技术能力方面，我擅长通过​​工程化思维​​解决复杂场景需求。比如在​​小红书开放平台​​项目中，我独立完成从 ​​OCR验证组件封装​​ 到 ​​AI客服功能​​ 的全流程开发，利用 ​​SSE​​ 实现大模型流式响应，通过交互链路优化将工单处理效率​​提升30%​​。这段经历让我沉淀了​​复杂表单状态管理​​和​​高并发场景优化​​经验。在​​自动驾驶领域​​实习期间，我主导了 ​​PhiX播放工具​​ 的性能优化：针对 ​​3D视图卡顿​​ 问题，通过 ​​Three.js渲染管线优化​​ 和​​虚拟滚动技术​​，将万级数据量下的 ​​FPS从12提升至45​​；重构 ​​Echarts封装层​​ 时引入​​策略模式​​，使图表扩展成本​​降低60%​​。这让我对​​数据可视化领域​​有了更深层的架构理解。学术方面，我参与过校企合作的​​二三维管线可视化项目​​，负责 ​​Cesium功能模块封装​​ 和 ​​Echarts大屏适配方案​​。通过调研 ​​Proj4库​​ 实现坐标转换通用组件，解决​​三维空间分析精度​​问题，最终系统被合作方纳入​​生产环境​​使用。个人持续保持技术输出，独立开发的​​全栈写作平台​​已接入​​讯飞大模型API​​，采用 ​​JWT+动态路由​​ 方案实现权限体系，​​SSE流式输出​​使AI生成响应速度​​提升2倍​​。这个项目在 ​​GitHub​​ 获得​​12个star​​，目前正在迭代​​可视化编辑器模块​​。我的优势在于既能快速理解业务场景，又能通过技术选型创造业务价值。希望能有机会用我的技术能力为贵司项目带来实质性提升。',
      analysis: '自我介绍应突出个人技能和经验，可以按照"个人身份-擅长技术-项目经验-成就"的顺序展开。'
    };
  } else if (question.includes('项目') || question.includes('经验')) {
    return {
      response: '我主要参与过电商平台、企业管理系统和在线教育平台三个大型项目。其中在电商平台项目中，我负责前端架构和核心购物流程开发，使用React+TypeScript构建了高复用性组件库，并通过虚拟滚动和懒加载技术使页面加载速度提升了40%。',
      analysis: '项目经验介绍应包含"项目背景-个人职责-使用技术-解决难点-项目成果"，突出技术难点和个人贡献。'
    };
  } else if (question.includes('技术') || question.includes('栈')) {
    return {
      response: '我的主要技术栈包括：前端框架React、Vue.js，语言TypeScript，构建工具Webpack、Vite，UI库Material UI、Ant Design，状态管理Redux、Mobx，服务端渲染Next.js等。后端有Node.js和Express经验，数据库使用过MongoDB和MySQL。',
      analysis: '技术栈介绍应从前端-后端-数据库有层次地展开，要点是展示技术广度和深度，可适当补充对各技术的理解。'
    };
  } else {
    return {
      response: '对于这个问题，我认为需要结合具体情境进行分析。在我的工作经验中，我始终注重技术与业务的结合，通过不断学习和实践来提升自己的能力和价值。',
      analysis: '对于开放性问题，可以先表明观点，然后结合个人经验进行阐述，最后给出自己的见解或总结。'
    };
  }
};

/**
 * 面试会话客户端模块
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
  
  // 语音识别相关状态
  const [currentQuestion, setCurrentQuestion] = useState('');   // 当前确认的问题（处理中或已处理）
  const [interimText, setInterimText] = useState('');          // 临时识别文本（尚未处理）
  const [aiResponse, setAiResponse] = useState('');            // AI回复内容
  const [analysisResponse, setAnalysisResponse] = useState(''); // 分析回复内容
  
  // 对话历史
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  // ==================== Refs ====================
  
  // 静音检测和定时器引用
  const lastVoiceActivityRef = useRef<number>(Date.now());
  const textUpdateTimeRef = useRef<number>(Date.now());
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 请求状态标记
  const isProcessingRef = useRef<boolean>(false);
  const recognizedTextRef = useRef<string>('');
  const processingQuestionRef = useRef<string>('');
  
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
  
  /**
   * 检测操作系统类型
   */
  const detectOS = () => {
    return navigator.userAgent.indexOf('Mac') !== -1;
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
   * @param question 问题文本
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
   * 获取AI回复（模拟）
   * @param userInput 用户输入的问题
   */
  const fetchAIResponse = async (userInput: string) => {
    // 如果没有内容，不做处理
    if (!userInput.trim()) {
      isProcessingRef.current = false;
      setRecognizingState();
      return;
    }
    
    try {
      clientLogger.info('请求AI回复，问题：', userInput);
      
      // 获取AI回复（模拟）
      const { response, analysis } = await mockAIResponse(userInput);
      
      // 更新状态
      setAnalysisResponse(analysis);
      setAiResponse(response);
      
      // 更新对话历史
      setChatHistory(prev => [
        ...prev,
        { role: 'user', content: userInput, timestamp: Date.now() },
        { role: 'assistant', content: response, timestamp: Date.now() }
      ]);
      
    } catch (error) {
      clientLogger.error('获取AI回复失败:', error);
      // 显示错误信息
      setAnalysisResponse('获取分析失败，请重试');
      setAiResponse('回答生成失败，请重试');
    } finally {
      // 处理完成后重置状态
      isProcessingRef.current = false;
      
      // 清空识别的文本，准备接收新问题
      recognizedTextRef.current = '';
      
      // 不再自动切换回识别状态，等待下次语音活动触发时才切换
      // setTimeout(() => {
      //   if (!isProcessingRef.current) {
      //     setRecognizingState();
      //   }
      // }, 500);
      
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
  const handleExitInterview = () => {
    // 停止录音和识别
    clientLogger.info('停止语音识别');
    stopRecognition();
    
    // 清除定时器
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
    }
    
    // 返回主页面
    router.push('/');
  };
  
  // ==================== 效果钩子 ====================
  
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
   * 获取回答面板内容
   */
  const getResponseContent = () => {
    if (uiState === UIState.INITIAL && !aiResponse) {
      return '此处将显示AI的实时回答';
    } else if (uiState === UIState.PROCESSING && !aiResponse) {
      return '正在生成中，请稍后...';
    }
    return aiResponse || '此处将显示AI的实时回答';
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
          placeholder={getQuestionPlaceholder()}
          isRecognizing={uiState === UIState.RECOGNIZING}
          interimText=""
        />

        {/* 中间分析和AI回答区域 */}
        <AnalysisResponsePanel
          analysisContent={getAnalysisContent()}
          responseContent={getResponseContent()}
          isLoading={uiState === UIState.PROCESSING && !aiResponse}
          analysisPlaceholder="此处将显示面试问题的回答思路供参考"
          responsePlaceholder="此处将显示AI的实时回答"
        />

        {/* 右侧对话历史区域 */}
        <ConversationHistoryPanel 
          history={chatHistory} 
          placeholder="此处将显示对话记录"
        />
      </SessionLayout>
    </Box>
  );
}