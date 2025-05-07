// state/chatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

/**
 * 聊天状态接口
 */
interface ChatState {
  // 当前活动的会话ID
  sessionId: string | null;
  // 是否有活动的会话
  hasActiveSession: boolean;
  // 聊天消息历史
  messages: ChatMessage[];
}

/**
 * 聊天动作接口
 */
interface ChatActions {
  // 设置会话ID
  setSessionId: (id: string) => void;
  // 清除会话ID
  clearSessionId: () => void;
  // 添加用户消息
  addUserMessage: (content: string) => void;
  // 添加AI回复消息
  addAssistantMessage: (content: string) => void;
  // 添加系统消息
  addSystemMessage: (content: string) => void;
  // 从历史记录加载消息
  loadMessages: (messages: ChatMessage[]) => void;
  // 清空消息历史
  clearMessages: () => void;
  // 获取所有消息
  getAllMessages: () => ChatMessage[];
}

// 初始状态
const initialState: ChatState = {
  sessionId: null,
  hasActiveSession: false,
  messages: []
};

/**
 * 聊天状态管理
 */
export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      /**
       * 设置会话ID
       * @param id 会话ID
       */
      setSessionId: (id: string) => {
        set({ 
          sessionId: id,
          hasActiveSession: true
        });
      },
      
      /**
       * 清除会话ID
       */
      clearSessionId: () => {
        set({ 
          sessionId: null,
          hasActiveSession: false
        });
      },
      
      /**
       * 添加用户消息
       * @param content 消息内容
       */
      addUserMessage: (content: string) => {
        const message: ChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: Date.now()
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
      },
      
      /**
       * 添加AI回复消息
       * @param content 消息内容
       */
      addAssistantMessage: (content: string) => {
        const message: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content,
          timestamp: Date.now()
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
      },
      
      /**
       * 添加系统消息
       * @param content 消息内容
       */
      addSystemMessage: (content: string) => {
        const message: ChatMessage = {
          id: `system-${Date.now()}`,
          role: 'system',
          content,
          timestamp: Date.now()
        };
        
        set(state => ({
          messages: [...state.messages, message]
        }));
      },
      
      /**
       * 从历史记录加载消息
       * @param messages 消息列表
       */
      loadMessages: (messages: ChatMessage[]) => {
        set({ messages });
      },
      
      /**
       * 清空消息历史
       */
      clearMessages: () => {
        set({ messages: [] });
      },
      
      /**
       * 获取所有消息
       * @returns 消息列表
       */
      getAllMessages: () => {
        return get().messages;
      }
    }),
    {
      name: 'chat-storage',
      // 仅持久化sessionId，不持久化消息
      partialize: (state) => ({ sessionId: state.sessionId })
    }
  )
);