/**
 * API端点映射
 * 所有API路径集中管理
 */
export const API_ENDPOINTS = {
    // 认证模块
    AUTH_LOGIN_OR_REGISTER: '/api/auth/loginOrRegister',
    AUTH_USER_INFO: '/api/auth/userInfo',
    
    // AI面试模块
    AI_SESSION_CREATE: '/api/ai/session/create',
    AI_MESSAGE_SEND: '/api/ai/message/send',
    AI_CONVERSATION_HISTORY: '/api/ai/conversation',
    AI_CONVERSATION_SAVE: '/api/ai/conversation/save',
    AI_STREAM_MESSAGE: (sessionId: string) => `/api/ai/conversation/${sessionId}/stream`,
    
    // 简历模块
    RESUME_LIST: '/api/resume/list',
    RESUME_DETAIL: (id: string) => `/api/resume/${id}`,
    RESUME_SAVE: '/api/resume/save',
    RESUME_DELETE: (id: string) => `/api/resume/delete/${id}`,
    RESUME_UPLOAD: '/api/upload/resume'
};