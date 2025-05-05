import { useCallback, useEffect, useRef, useState } from 'react';
import CryptoJS from 'crypto-js';
import { clientLogger } from './logger';

/**
 * WebSocket消息类型定义
 */
interface WSMessage {
  action: string;
  code?: number;
  data?: any;
  sid?: string;
  desc?: string;
}

/**
 * 讯飞语音识别配置
 */
export interface XfyunSpeechConfig {
  /** 应用ID */
  appId: string;
  /** API密钥 */
  apiKey: string;
  /** 语言，默认中文 */
  lang?: string;
}

/**
 * 语音识别状态
 */
export enum RecognitionStatus {
  /** 未初始化 */
  UNINITIATED = 'uninitiated',
  /** 就绪状态 */
  READY = 'ready',
  /** 识别中 */
  RECOGNIZING = 'recognizing',
  /** 已停止 */
  STOPPED = 'stopped',
  /** 出错 */
  ERROR = 'error',
}

/**
 * 讯飞语音识别Hook返回值
 */
export interface UseXfyunSpeechReturn {
  /** 识别状态 */
  status: RecognitionStatus;
  /** 最终结果文本 */
  transcript: string;
  /** 中间结果文本 */
  interimTranscript: string;
  /** 错误信息 */
  error: Error | null;
  /** 开始识别 */
  startRecognition: () => Promise<void>;
  /** 停止识别 */
  stopRecognition: () => void;
  /** 重置识别结果 */
  resetTranscript: () => void;
}

/**
 * 生成讯飞WebSocket认证URL
 * @param appId 应用ID
 * @param apiKey API密钥
 * @param lang 识别语言，默认中文
 * @returns 认证URL
 */
const getAuthUrl = (
  appId: string,
  apiKey: string,
  lang: string = 'cn'
): string => {
  // 科大讯飞实时语音转写API的WebSocket地址
  const host = 'wss://rtasr.xfyun.cn/v1/ws';
  
  // 当前时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
  const ts = Math.floor(new Date().getTime() / 1000);
  
  // 计算签名
  const signa = CryptoJS.MD5(appId + ts).toString();
  const signatureSha = CryptoJS.HmacSHA1(signa, apiKey);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);
  
  // 构建URL参数
  const params = new URLSearchParams();
  params.append('appid', appId);
  params.append('ts', ts.toString());
  params.append('signa', signature);
  
  // 添加语言参数
  if (lang) {
    params.append('lang', lang);
  }
  
  // 构建最终URL
  const url = `${host}?${params.toString()}`;
  clientLogger.info('已生成讯飞WebSocket认证URL', { 
    appId, 
    ts, 
    lang,
    // 安全起见，不打印完整apiKey和签名
    apiKeyMask: apiKey.substring(0, 4) + '********'
  });
  return url;
};

/**
 * 科大讯飞语音识别Hook
 * @param config 讯飞语音识别配置
 * @returns UseXfyunSpeechReturn
 */
export const useXfyunSpeech = (config: XfyunSpeechConfig): UseXfyunSpeechReturn => {
  // 使用useRef保存配置，避免每次渲染时都重新打印初始化日志
  const configRef = useRef<XfyunSpeechConfig>(config);
  const isInitialMount = useRef(true);
  
  // 仅在首次挂载时打印日志
  if (isInitialMount.current) {
    clientLogger.info('初始化讯飞语音识别Hook', {
      appId: config.appId,
      lang: config.lang || 'cn'
    });
    isInitialMount.current = false;
  }
  
  // 状态管理
  const [status, setStatus] = useState<RecognitionStatus>(RecognitionStatus.UNINITIATED);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  
  // 引用管理
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  /**
   * 初始化WebSocket连接
   */
  const initWebSocket = useCallback(async (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      try {
        // 生成鉴权URL
        const url = getAuthUrl(configRef.current.appId, configRef.current.apiKey, configRef.current.lang);
        
        // 创建WebSocket连接
        const ws = new WebSocket(url);
        wsRef.current = ws;
        
        // 连接超时处理
        const connectionTimeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
            clientLogger.error('WebSocket连接超时');
            reject(new Error('WebSocket连接超时'));
          }
        }, 5000);
        
        // 连接打开事件
        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          clientLogger.info('WebSocket连接已打开，讯飞语音识别已就绪');
          setStatus(RecognitionStatus.READY);
          resolve(ws);
        };
        
        // 接收消息事件
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WSMessage;
            
            // 处理不同类型的消息
            if (message.action === 'started') {
              // 识别开始
              clientLogger.info('讯飞语音识别已开始');
              setStatus(RecognitionStatus.RECOGNIZING);
            } else if (message.action === 'result') {
              // 解析结果数据
              if (message.data) {
                try {
                  const resultData = JSON.parse(message.data);
                  
                  // 提取文本
                  let words = '';
                  
                  if (resultData.cn?.st?.rt) {
                    // 提取所有词汇并拼接
                    for (const rt of resultData.cn.st.rt) {
                      if (rt.ws) {
                        for (const ws of rt.ws) {
                          if (ws.cw) {
                            for (const cw of ws.cw) {
                              if (cw.w && cw.w.trim()) {
                                words += cw.w;
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  
                  // 根据type字段区分临时文本和最终文本
                  const type = resultData.cn?.st?.type;
                  if (type === '0') {
                    // 最终结果
                    clientLogger.info('接收到讯飞语音识别最终结果', { words });
                    setTranscript(prev => prev + words);
                    setInterimTranscript('');
                  } else if (type === '1') {
                    // 临时结果
                    if (words.length > 2) {  // 避免打印太短的临时结果
                      clientLogger.debug('接收到讯飞语音识别临时结果', { words });
                    }
                    setInterimTranscript(words);
                  }
                } catch (err) {
                  clientLogger.error('解析result data JSON出错:', err);
                }
              }
            } else if (message.action === 'error') {
              // 处理错误
              const errorMsg = message.desc || '未知错误';
              clientLogger.error('讯飞语音识别返回错误:', {
                code: message.code,
                message: errorMsg
              });
              const err = new Error(errorMsg);
              setError(err);
              setStatus(RecognitionStatus.ERROR);
            }
          } catch (err) {
            clientLogger.error('解析WebSocket消息出错:', err);
          }
        };
        
        // 错误处理
        ws.onerror = (event) => {
          clientLogger.error('WebSocket连接错误', event);
          const err = new Error('WebSocket连接错误');
          setError(err);
          setStatus(RecognitionStatus.ERROR);
          reject(err);
        };
        
        // 连接关闭处理
        ws.onclose = () => {
          clientLogger.info('WebSocket连接已关闭');
          // 仅在非主动停止的情况下更改状态
          if (status !== RecognitionStatus.STOPPED) {
            setStatus(RecognitionStatus.STOPPED);
          }
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('初始化WebSocket时出错');
        setError(error);
        setStatus(RecognitionStatus.ERROR);
        reject(error);
      }
    });
  }, [status]); // 仅依赖status状态，避免每次渲染都重新创建回调
  
  /**
   * 开始语音识别
   */
  const startRecognition = useCallback(async (): Promise<void> => {
    try {
      clientLogger.info('开始初始化语音识别...');
      // 重置错误状态
      setError(null);
      
      // 请求屏幕共享权限以获取系统音频
      clientLogger.info('请求屏幕共享和系统音频权限...');
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        }
      });
      mediaStreamRef.current = stream;
      
      // 检查是否有音频轨道
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error('无法获取到系统音频轨道，请检查屏幕共享时的音频授权');
      }
      clientLogger.info('系统音频权限已获取，轨道数量:', { trackCount: audioTracks.length });
      
      // 监听视频轨道结束事件（用户停止了屏幕共享）
      stream.getVideoTracks()[0].onended = () => {
        clientLogger.info('屏幕共享已停止，停止语音识别');
        // 使用内部函数停止媒体流和连接
        stopStreamAndConnection();
        // 更新状态
        setStatus(RecognitionStatus.STOPPED);
      };
      
      // 初始化WebSocket
      clientLogger.info('初始化讯飞WebSocket连接...');
      const ws = await initWebSocket();
      clientLogger.info('讯飞WebSocket连接已建立');
      
      // 创建音频上下文
      clientLogger.info('创建音频处理上下文...');
      const audioContext = new AudioContext({
        sampleRate: 16000 // 讯飞要求的采样率
      });
      audioContextRef.current = audioContext;
      
      // 创建音频源
      const source = audioContext.createMediaStreamSource(stream);
      
      // 创建音频处理节点（使用较小的缓冲区大小，减少延迟）
      const processor = audioContext.createScriptProcessor(1024, 1, 1);
      processorRef.current = processor;
      
      // 音频处理事件
      processor.onaudioprocess = (e) => {
        // 确保WebSocket连接打开
        if (ws.readyState === WebSocket.OPEN) {
          // 获取音频数据
          const inputData = e.inputBuffer.getChannelData(0);
          
          // 转换为16位PCM
          const pcmData = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]));
            pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          
          // 发送音频数据
          ws.send(pcmData.buffer);
        }
      };
      
      // 连接音频节点
      clientLogger.info('连接音频处理节点...');
      source.connect(processor);
      processor.connect(audioContext.destination);
      
      // 更新状态
      clientLogger.info('语音识别已启动, 开始传输系统音频数据');
      setStatus(RecognitionStatus.RECOGNIZING);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('启动语音识别时出错');
      clientLogger.error('启动语音识别失败:', error);
      
      // 针对特定错误提供更友好的错误信息
      if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
        clientLogger.error('用户拒绝了屏幕共享或音频捕获权限');
      } else if (error.message.includes('无法获取到系统音频轨道')) {
        clientLogger.error('获取系统音频失败，请确保在屏幕共享时选择了"分享系统音频"选项');
      }
      
      setError(error);
      setStatus(RecognitionStatus.ERROR);
      
      // 清理资源
      stopStreamAndConnection();
      
      throw error;
    }
  }, [initWebSocket]);
  
  /**
   * 停止语音识别
   */
  const stopRecognition = useCallback(() => {
    clientLogger.info('停止语音识别...');
    
    // 使用公共函数停止媒体流和连接
    stopStreamAndConnection();
    
    // 更新状态
    clientLogger.info('语音识别已完全停止');
    setStatus(RecognitionStatus.STOPPED);
  }, []);
  
  /**
   * 重置识别结果
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);
  
  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);
  
  /**
   * 停止媒体流和连接
   */
  const stopStreamAndConnection = () => {
    // 关闭音频处理
    if (processorRef.current) {
      clientLogger.debug('断开音频处理节点');
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (audioContextRef.current) {
      clientLogger.debug('关闭音频上下文');
      audioContextRef.current.close().catch(err => clientLogger.error('关闭音频上下文失败:', err));
      audioContextRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      clientLogger.debug('停止所有音频轨道');
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // 关闭WebSocket连接
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        // 发送结束指令
        try {
          clientLogger.debug('发送结束指令到讯飞服务器');
          wsRef.current.send(JSON.stringify({ "end": true }));
        } catch (error) {
          clientLogger.error('发送结束消息失败:', error);
        }
      }
      
      // 延迟关闭WebSocket
      setTimeout(() => {
        if (wsRef.current) {
          clientLogger.debug('关闭WebSocket连接');
          wsRef.current.close();
          wsRef.current = null;
        }
      }, 1000);
    }
  };
  
  return {
    status,
    transcript,
    interimTranscript,
    error,
    startRecognition,
    stopRecognition,
    resetTranscript,
  };
}; 