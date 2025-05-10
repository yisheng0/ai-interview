import { create } from 'zustand';
import { 
  Interview, 
  InterviewStatus, 
  RoundStatus, 
  InterviewRound,
  createInterview as apiCreateInterview,
  updateInterview as apiUpdateInterview,
  deleteInterview as apiDeleteInterview,
  deleteInterviewRound as apiDeleteInterviewRound,
  getInterviewList
} from '@/api/services/interviewService';
import { clientLogger } from '@/utils/logger';

/**
 * 旧版面试接口 - 兼容现有组件
 */
export interface LegacyInterview {
  uuid?: string;
  company_name: string;
  job_title: string;
  introduction: string;
  interview_status: InterviewStatus;
  interview_round_list: Array<{
    uuid?: string;
    round_no: number;
    round_name?: string;
    schedule_date: string;
    status?: string;
  }>;
}

/**
 * 新版面试接口转换到旧版
 * @param interview 新版面试数据
 * @returns 旧版面试数据结构
 */
export function convertToLegacyInterview(interview: Interview): LegacyInterview {
  return {
    uuid: interview.id,
    company_name: interview.company,
    job_title: interview.position,
    introduction: interview.description,
    interview_status: interview.status,
    interview_round_list: interview.rounds.map(round => ({
      uuid: round.id,
      round_no: round.roundNumber,
      round_name: 
        round.roundNumber === 1 ? '一面' : 
        round.roundNumber === 2 ? '二面' : 
        round.roundNumber === 3 ? '三面' : `${round.roundNumber}面`,
      schedule_date: round.scheduledTime,
      status: round.status
    }))
  };
}

/**
 * 旧版面试接口转换到新版
 * @param legacy 旧版面试数据
 * @returns 新版面试数据结构
 */
export function convertToInterview(legacy: LegacyInterview): Interview {
  return {
    id: legacy.uuid,
    company: legacy.company_name,
    position: legacy.job_title,
    description: legacy.introduction,
    status: legacy.interview_status,
    rounds: legacy.interview_round_list.map((round, index) => ({
      id: round.uuid,
      roundNumber: round.round_no || index + 1,
      scheduledTime: round.schedule_date,
      status: (round.status as RoundStatus) || RoundStatus.PENDING
    }))
  };
}

/**
 * 面试状态存储接口
 */
interface InterviewStore {
  // 状态
  interviews: Interview[];
  isLoading: boolean;
  error: string | null;
  currentInterview: Interview | null;
  
  // 获取面试列表
  fetchInterviews: () => Promise<void>;
  
  // 创建/更新/删除面试
  createInterview: (interview: Interview) => Promise<Interview>;
  updateInterview: (interview: Interview) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<boolean>;
  
  // 更新/删除面试轮次
  deleteInterviewRound: (id: string) => Promise<boolean>;
  
  // 当前面试管理
  setCurrentInterview: (interview: Interview | null) => void;
  clearCurrentInterview: () => void;
}

/**
 * 创建面试状态管理钩子
 */
export const useInterviewStore = create<InterviewStore>()((set, get) => ({
  // 初始状态
  interviews: [],
  isLoading: false,
  error: null,
  currentInterview: null,
  
  // 获取面试列表
  fetchInterviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const interviews = await getInterviewList();
      set({ interviews, isLoading: false });
    } catch (error) {
      clientLogger.error('获取面试列表失败', error);
      set({ 
        error: error instanceof Error ? error.message : '获取面试列表失败', 
        isLoading: false 
      });
    }
  },
  
  // 创建面试
  createInterview: async (interview) => {
    try {
      set({ isLoading: true, error: null });
      
      const createdInterview = await apiCreateInterview({
        company: interview.company,
        position: interview.position,
        description: interview.description,
        resumeId: interview.resumeId,
        scheduledTime: interview.rounds[0]?.scheduledTime || new Date().toISOString()
      });
      
      // 更新面试列表
      set(state => ({
        interviews: [...state.interviews, createdInterview],
        isLoading: false,
        currentInterview: createdInterview
      }));
      
      return createdInterview;
    } catch (error) {
      clientLogger.error('创建面试失败', error);
      set({ 
        error: error instanceof Error ? error.message : '创建面试失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // 更新面试
  updateInterview: async (interview) => {
    if (!interview.id) {
      throw new Error('面试ID不能为空');
    }
    
    try {
      set({ isLoading: true, error: null });
      
      const updatedInterview = await apiUpdateInterview({
        id: interview.id,
        company: interview.company,
        position: interview.position,
        description: interview.description,
        resumeId: interview.resumeId,
        status: interview.status,
        rounds: interview.rounds.map(round => ({
          id: round.id,
          scheduledTime: round.scheduledTime,
          status: round.status
        }))
      });
      
      // 更新面试列表
      set(state => ({
        interviews: state.interviews.map(item => 
          item.id === updatedInterview.id ? updatedInterview : item
        ),
        isLoading: false,
        currentInterview: updatedInterview
      }));
      
      return updatedInterview;
    } catch (error) {
      clientLogger.error('更新面试失败', error);
      set({ 
        error: error instanceof Error ? error.message : '更新面试失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // 删除面试
  deleteInterview: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const result = await apiDeleteInterview(id);
      
      if (result) {
        // 更新面试列表
        set(state => ({
          interviews: state.interviews.filter(item => item.id !== id),
          isLoading: false,
          currentInterview: state.currentInterview?.id === id ? null : state.currentInterview
        }));
      }
      
      return result;
    } catch (error) {
      clientLogger.error('删除面试失败', error);
      set({ 
        error: error instanceof Error ? error.message : '删除面试失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // 删除面试轮次
  deleteInterviewRound: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const result = await apiDeleteInterviewRound(id);
      
      if (result) {
        // 刷新面试列表
        await get().fetchInterviews();
      }
      
      return result;
    } catch (error) {
      clientLogger.error('删除面试轮次失败', error);
      set({ 
        error: error instanceof Error ? error.message : '删除面试轮次失败', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  // 设置当前面试
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  
  // 清除当前面试
  clearCurrentInterview: () => set({ currentInterview: null }),
})); 