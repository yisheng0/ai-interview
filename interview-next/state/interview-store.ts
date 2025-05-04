import { create } from 'zustand';

/**
 * 面试状态枚举
 */
export enum InterviewStatus {
  /**
   * 未开始
   */
  PASS = 'PASS',
  /**
   * 进行中
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   * 已终止
   */
  TERMINATE = 'TERMINATE',
}

/**
 * 面试数据接口
 */
export interface Interview {
  uuid?: string;
  company_name: string;
  job_title: string;
  introduction: string;
  interview_status: InterviewStatus;
  interview_round_list: any[];
}

/**
 * 面试状态存储接口
 */
interface InterviewStore {
  currentInterview: Interview | null;
  setCurrentInterview: (interview: Interview | null) => void;
  clearCurrentInterview: () => void;
}

/**
 * 创建面试状态管理钩子
 */
export const useInterviewStore = create<InterviewStore>()((set) => ({
  currentInterview: null,
  setCurrentInterview: (interview) => set({ currentInterview: interview }),
  clearCurrentInterview: () => set({ currentInterview: null }),
})); 