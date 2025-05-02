import { create } from 'zustand';

/**
 * 弹窗状态
 */
interface ModalState {
  /**
   * 微信客服咨询弹窗标题
   */
  wechatCustomerServiceTitle: string;

  /**
   * 微信客服咨询弹窗是否打开
   */
  isWechatCustomerServiceOpen: boolean;

  /**
   * 打开微信客服咨询弹窗
   * @param options - 可选参数对象
   * @param options.title - 可选的弹窗标题，默认为"联系客服"
   */
  openWechatCustomerService: (options?: { title?: string } | void) => void;

  /**
   * 关闭微信客服咨询弹窗
   */
  closeWechatCustomerService: () => void;

  /**
   * 访问受限弹窗是否打开
   */
  isForbiddenOpen: boolean;

  /**
   * 打开访问受限弹窗
   */
  openForbidden: () => void;

  /**
   * 关闭访问受限弹窗
   */
  closeForbidden: () => void;

  /**
   * 未授权弹窗是否打开
   */
  isUnauthorizedOpen: boolean;

  /**
   * 打开未授权弹窗
   */
  openUnauthorized: () => void;

  /**
   * 关闭未授权弹窗
   */
  closeUnauthorized: () => void;

  /**
   * 议程图片上传弹窗是否打开
   */
  isAgendaImageUploadDialogOpen: boolean;

  /**
   * 打开议程图片上传弹窗
   */
  openAgendaImageUploadDialog: () => void;

  /**
   * 关闭议程图片上传弹窗
   */
  closeAgendaImageUploadDialog: () => void;

  /**
   * 面试议程详情弹窗是否打开
   */
  isInterviewAgendaDetailDialogOpen: boolean;

  /**
   * 打开面试议程详情弹窗
   */
  openInterviewAgendaDetailDialog: () => void;

  /**
   * 关闭面试议程详情弹窗
   */
  closeInterviewAgendaDetailDialog: () => void;

  /**
   * 会话计费错误弹窗是否打开
   */
  isSessionBillingErrorDialogOpen: boolean;

  /**
   * 打开会话计费错误弹窗
   */
  openSessionBillingErrorDialog: () => void;

  /**
   * 关闭会话计费错误弹窗
   */
  closeSessionBillingErrorDialog: () => void;

  /**
   * 低余额提醒对话框是否打开
   */
  isLowBalanceDialogOpen: boolean;

  /**
   * 打开低余额提醒对话框
   */
  openLowBalanceDialog: () => void;

  /**
   * 关闭低余额提醒对话框
   */
  closeLowBalanceDialog: () => void;
}

/**
 * 弹窗状态管理
 */
export const useModalStore = create<ModalState>(set => ({
  /**
   * 微信客服咨询弹窗标题
   */
  wechatCustomerServiceTitle: '联系客服',

  /**
   * 微信客服咨询弹窗是否打开
   */
  isWechatCustomerServiceOpen: false,

  /**
   * 打开微信客服咨询弹窗
   * @param options - 可选参数对象
   * @param options.title - 可选的弹窗标题，默认为"联系客服"
   */
  openWechatCustomerService: (options?: { title?: string } | void) =>
    set({
      isWechatCustomerServiceOpen: true,
      wechatCustomerServiceTitle: options?.title ?? '联系客服',
    }),

  /**
   * 关闭微信客服咨询弹窗
   */
  closeWechatCustomerService: () => set({ isWechatCustomerServiceOpen: false }),

  /**
   * 访问受限弹窗是否打开
   */
  isForbiddenOpen: false,

  /**
   * 未授权弹窗是否打开
   */
  isUnauthorizedOpen: false,

  /**
   * 打开访问受限弹窗
   */
  openForbidden: () => set({ isForbiddenOpen: true }),

  /**
   * 关闭访问受限弹窗
   */
  closeForbidden: () => set({ isForbiddenOpen: false }),

  /**
   * 打开未授权弹窗
   */
  openUnauthorized: () => set({ isUnauthorizedOpen: true }),

  /**
   * 关闭未授权弹窗
   */
  closeUnauthorized: () => set({ isUnauthorizedOpen: false }),

  /**
   * 议程图片上传弹窗是否打开
   */
  isAgendaImageUploadDialogOpen: false,

  /**
   * 打开议程图片上传弹窗
   */
  openAgendaImageUploadDialog: () => set({ isAgendaImageUploadDialogOpen: true }),

  /**
   * 关闭议程图片上传弹窗
   */
  closeAgendaImageUploadDialog: () => set({ isAgendaImageUploadDialogOpen: false }),

  /**
   * 面试议程详情弹窗是否打开
   */
  isInterviewAgendaDetailDialogOpen: false,

  /**
   * 打开面试议程详情弹窗
   */
  openInterviewAgendaDetailDialog: () => set({ isInterviewAgendaDetailDialogOpen: true }),

  /**
   * 关闭面试议程详情弹窗
   */
  closeInterviewAgendaDetailDialog: () => set({ isInterviewAgendaDetailDialogOpen: false }),

  /**
   * 会话计费错误弹窗是否打开
   */
  isSessionBillingErrorDialogOpen: false,

  /**
   * 打开会话计费错误弹窗
   */
  openSessionBillingErrorDialog: () => set({ isSessionBillingErrorDialogOpen: true }),

  /**
   * 关闭会话计费错误弹窗
   */
  closeSessionBillingErrorDialog: () => set({ isSessionBillingErrorDialogOpen: false }),

  /**
   * 低余额提醒对话框是否打开
   */
  isLowBalanceDialogOpen: false,

  /**
   * 打开低余额提醒对话框
   */
  openLowBalanceDialog: () => set({ isLowBalanceDialogOpen: true }),

  /**
   * 关闭低余额提醒对话框
   */
  closeLowBalanceDialog: () => set({ isLowBalanceDialogOpen: false }),
}));
