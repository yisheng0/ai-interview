import { create } from 'zustand';
import { Interview } from './interview-store';

/**
 * 对话框状态存储接口
 */
interface ModalStore {
  // 面试议程详情弹窗状态
  isInterviewAgendaDetailDialogOpen: boolean;
  openInterviewAgendaDetailDialog: (interview?: Interview | null) => void;
  closeInterviewAgendaDetailDialog: () => void;
  
  // 当前选中的面试数据
  currentDialogInterview: Interview | null;
  setCurrentDialogInterview: (interview: Interview | null) => void;
  clearCurrentDialogInterview: () => void;
}

/**
 * 创建对话框状态管理钩子
 */
export const useModalStore = create<ModalStore>()((set) => ({
  // 面试议程详情弹窗状态
  isInterviewAgendaDetailDialogOpen: false,
  openInterviewAgendaDetailDialog: (interview = null) => set({ 
    isInterviewAgendaDetailDialogOpen: true,
    currentDialogInterview: interview
  }),
  closeInterviewAgendaDetailDialog: () => set({ 
    isInterviewAgendaDetailDialogOpen: false,
    currentDialogInterview: null  // 关闭弹窗时同时清除当前面试数据
  }),
  
  // 当前选中的面试数据
  currentDialogInterview: null,
  setCurrentDialogInterview: (interview) => set({ currentDialogInterview: interview }),
  clearCurrentDialogInterview: () => set({ currentDialogInterview: null }),
}));
