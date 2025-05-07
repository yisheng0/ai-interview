import http from '../httpClient';
import { ServerResponse } from '@/utils/exception-handler';
import { API_ENDPOINTS } from '../apiEndpoints';
import { clientLogger } from '@/utils/logger';
import { useAuthStore } from '@/state';

/**
 * 会话创建响应接口
 */
export interface SessionCreateResponse {
  sessionId: string;
}

/**
 * AI消息响应接口
 */
export interface MessageResponse {
  reply: string;
}

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

/**
 * 创建AI会话
 * @param interviewId 面试ID
 * @param roundId 轮次ID
 * @returns 会话创建响应
 */
function createSession(interviewId: string, roundId: string): Promise<ServerResponse<SessionCreateResponse>> {
  return http.post<SessionCreateResponse>('AI_SESSION_CREATE', { interviewId, roundId });
}

/**
 * 发送消息并获取回复
 * @param sessionId 会话ID
 * @param message 用户消息
 * @returns 消息响应
 */
function sendMessage(sessionId: string, message: string): Promise<ServerResponse<MessageResponse>> {
  // 使用POST请求发送消息
  return http.post<MessageResponse>('AI_MESSAGE_SEND', { 
    sessionId, 
    message,
    streaming: false // 显式指定非流式请求
  });
}

/**
 * 获取对话历史
 * @param sessionId 会话ID
 * @returns 对话历史
 */
function getConversationHistory(sessionId: string): Promise<ServerResponse<ChatMessage[]>> {
  return http.get<ChatMessage[]>(`AI_CONVERSATION_HISTORY/${sessionId}`);
}

/**
 * 保存对话历史
 * @param sessionId 会话ID
 * @param history 对话历史
 * @returns 保存结果
 */
function saveConversation(sessionId: string, history: ChatMessage[]): Promise<ServerResponse<null>> {
  return http.post<null>('AI_CONVERSATION_SAVE', { sessionId, history });
}

/**
 * 创建流式消息连接（使用fetch实现）
 * @param sessionId 会话ID
 * @param message 用户消息
 * @param onChunk 数据块回调
 * @param onComplete 完成回调
 * @param onError 错误回调
 * @returns 取消函数
 */
function createStreamingConnection(
  sessionId: string,
  message: string,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): () => void {
  // 记录是否已经取消
  let isCancelled = false;
  let buffer = ''; // 用于存储可能被分割的JSON数据
  
  // 使用与httpClient一致的认证方式
  const token = useAuthStore.getState().token;
  
  // 构建URL和请求选项 - 使用流式API端点
  const url = API_ENDPOINTS.AI_STREAM_MESSAGE(sessionId);
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*', // 使用通配符接受任何内容类型
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify({ 
      message,
      streaming: true // 显式指定为流式请求
    }), 
    credentials: 'include' // 确保包含cookie
  };
  
  clientLogger.info('发送流式请求:', { url, sessionId, message });
  
  // 启动异步处理
  (async () => {
    try {
      if (isCancelled) return;
      
      // 发送请求
      const response = await fetch(url, options);
      
      // 检查响应状态
      if (!response.ok) {
        clientLogger.error('流式响应错误:', { status: response.status, statusText: response.statusText });
        
        try {
          // 尝试解析JSON错误
          const errorData = await response.json();
          throw new Error(errorData.message || `服务器响应错误: ${response.status}`);
        } catch (jsonError) {
          // 尝试获取文本错误
          try {
            const textError = await response.text();
            throw new Error(textError || `服务器响应错误: ${response.status} ${response.statusText}`);
          } catch (textError) {
            throw new Error(`服务器响应错误: ${response.status} ${response.statusText}`);
          }
        }
      }
      
      // 获取响应流
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }
      
      // 创建文本解码器
      const decoder = new TextDecoder();
      
      // 读取流数据
      while (true) {
        if (isCancelled) {
          reader.cancel();
          break;
        }
        
        // 读取数据块
        const { done, value } = await reader.read();
        
        // 如果流结束则退出循环
        if (done) {
          onComplete();
          break;
        }
        
        // 解码并处理数据
        const chunk = decoder.decode(value, { stream: true });
        clientLogger.info('收到数据块:', chunk);
        
        // 添加到缓冲区
        buffer += chunk;
        
        // 处理缓冲区中的完整数据行
        const lines = buffer.split('\n');
        // 最后一行可能不完整，保留在缓冲区
        buffer = lines.pop() || '';
        
        // 处理每一个完整行
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith(':')) continue; // 跳过空行和注释
          
          try {
            // 处理以data:开头的SSE格式数据
            if (trimmedLine.startsWith('data:')) {
              const jsonStr = trimmedLine.slice(5).trim();
              const data = JSON.parse(jsonStr);
              
              // 处理内容
              if (data.content) {
                onChunk(data.content);
              }
              
              // 检查是否完成
              if (data.finished) {
                clientLogger.info('流式响应标记完成');
                reader.cancel(); // 主动取消读取
                onComplete();
                return;
              }
            } else {
              // 尝试将整行解析为JSON
              const data = JSON.parse(trimmedLine);
              if (data.content) {
                onChunk(data.content);
              }
              if (data.finished) {
                clientLogger.info('流式响应标记完成');
                reader.cancel(); // 主动取消读取
                onComplete();
                return;
              }
            }
          } catch (parseError) {
            clientLogger.warn('解析流式数据行失败:', {
              error: parseError,
              originalLine: trimmedLine
            });
            // 如果不是有效的JSON但有内容，直接作为文本发送
            if (trimmedLine && !trimmedLine.startsWith('data:')) {
              onChunk(trimmedLine);
            }
          }
        }
      }
    } catch (error) {
      if (!isCancelled) {
        clientLogger.error('流式请求错误:', error);
        onError(error instanceof Error ? error : new Error(String(error)));
      }
    }
  })();
  
  // 返回取消函数
  return () => {
    isCancelled = true;
  };
}

// 导出服务
export { 
  createSession, 
  sendMessage, 
  getConversationHistory, 
  saveConversation,
  createStreamingConnection 
}; 