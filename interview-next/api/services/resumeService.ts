import { get, post } from '../httpClient';
import { ServerResponse } from '@/utils/exception-handler';

/**
 * 教育经历类型
 */
export interface Education {
  id?: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
}

/**
 * 工作经验类型
 */
export interface Experience {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  current?: boolean;
}

/**
 * 简历数据类型
 */
export interface ResumeData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  education: Education[];
  workExperience: Experience[];
  skills: string[];
  selfDescription: string;
}

/**
 * 简历列表项类型
 */
export interface ResumeListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  updatedAt: string;
}

/**
 * 简历服务
 * 封装所有简历相关的API请求
 */
export const resumeService = {
  /**
   * 获取用户简历列表
   * @returns 简历列表
   */
  getResumeList: () => {
    return get<ResumeListItem[]>('RESUME_LIST');
  },

  /**
   * 获取简历详情
   * @param id 简历ID
   * @returns 简历详情
   */
  getResumeDetail: (id: string) => {
    return get<ResumeData>('RESUME_DETAIL', [id]);
  },

  /**
   * 保存简历
   * @param data 简历数据
   * @returns 保存结果
   */
  saveResume: (data: ResumeData) => {
    return post<ResumeData>('RESUME_SAVE', data);
  },

  /**
   * 删除简历
   * @param id 简历ID
   * @returns 删除结果
   */
  deleteResume: (id: string) => {
    return get<null>('RESUME_DELETE', [id]);
  },

  /**
   * OCR识别简历
   * @param message 提示词
   * @param fileOrUrl 文件对象或文件URL
   * @returns OCR识别结果
   */
  ocrRecognize: async (message: string, fileOrUrl: File | string) => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      // 根据参数类型决定添加file还是fileUrl
      if (fileOrUrl instanceof File) {
        formData.append('file', fileOrUrl);
      } else if (typeof fileOrUrl === 'string') {
        formData.append('fileUrl', fileOrUrl);
      }
      
      // 使用post方法发送FormData，指明是文件上传
      const response = await post<{ reply: string }>('AI_MESSAGE_SEND', formData, undefined, undefined, true);
      
      return response;
    } catch (error) {
      console.error('OCR识别失败:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : 'OCR识别失败，请稍后重试',
        data: null
      };
    }
  },

  /**
   * 上传简历文件
   * @param file 文件对象
   * @returns 上传结果
   */
  uploadResume: async (file: File): Promise<ServerResponse<{ fileUrl: string; fileName: string } | null>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // 使用httpClient的post方法处理上传，指定是文件上传
      return await post<{ fileUrl: string; fileName: string }>('RESUME_UPLOAD', formData, undefined, undefined, true);
    } catch (error) {
      console.error('上传简历失败:', error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : '上传简历失败',
        data: null
      };
    }
  },
}; 