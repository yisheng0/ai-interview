import { get, post, del } from '../httpClient';
import { POSITION_IMAGE_TO_JSON } from '@/utils/prompt';
import { clientLogger } from '../../utils/logger';

/**
 * 面试状态枚举
 */
export enum InterviewStatus {
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * 面试轮次状态枚举
 */
export enum RoundStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

/**
 * 面试结果枚举
 */
export enum InterviewResult {
  PASS = 'PASS',
  FAIL = 'FAIL'
}

/**
 * 面试轮次接口
 */
export interface InterviewRound {
  id?: string;
  roundNumber: number;
  scheduledTime: string;
  status: RoundStatus;
  sessionId?: string;
  result?: InterviewResult;
  notes?: string;
}

/**
 * 面试接口
 */
export interface Interview {
  id?: string;
  uuid?: string;
  userId?: number;
  company: string;
  position: string;
  description: string;
  status: InterviewStatus;
  resumeId?: string;
  createdAt?: string;
  rounds: InterviewRound[];
}

/**
 * 创建面试请求参数
 */
export interface CreateInterviewRequest {
  company: string;
  position: string;
  description: string;
  resumeId?: string;
  scheduledTime: string; // 第一轮面试时间
}

/**
 * 更新面试请求参数
 */
export interface UpdateInterviewRequest {
  id: string;
  company?: string;
  position?: string;
  description?: string;
  resumeId?: string;
  status?: InterviewStatus;
  rounds?: {
    id?: string;
    scheduledTime: string;
    status?: RoundStatus;
  }[];
}

/**
 * 面试API响应接口
 */
export interface InterviewResponse {
  code: number;
  message: string;
  data: Interview | Interview[] | null;
}

/**
 * 获取面试列表
 * @returns 面试列表数据
 */
export async function getInterviewList(): Promise<Interview[]> {
  try {
    const response = await get<Interview[]>('INTERVIEW_LIST');
    
    // 确保返回的数据格式正确
    if (response.code === 200 && response.data) {
      // 处理API返回的数据，确保包含必要的字段
      return response.data.map((interview: Interview) => ({
        ...interview,
        // 确保status字段存在且为正确的枚举值
        status: interview.status || InterviewStatus.ONGOING,
        // 确保rounds字段存在
        rounds: Array.isArray(interview.rounds) ? interview.rounds.map((round: any) => ({
          ...round,
          // 确保轮次状态为正确的枚举值
          status: round?.status || RoundStatus.PENDING,
          // 确保轮次编号存在
          roundNumber: round?.roundNumber || 1
        })) : []
      }));
    }
    return [];
  } catch (error) {
    clientLogger.error('获取面试列表失败', error);
    return [];
  }
}

/**
 * 创建面试
 * @param data 创建面试的参数
 * @returns 创建的面试数据
 */
export async function createInterview(data: CreateInterviewRequest): Promise<Interview> {
  const response = await post<Interview>('INTERVIEW_CREATE', data);
  return response.data as Interview;
}

/**
 * 更新面试
 * @param data 更新面试的参数
 * @returns 更新后的面试数据
 */
export async function updateInterview(data: UpdateInterviewRequest): Promise<Interview> {
  const response = await post<Interview>('INTERVIEW_UPDATE', data);
  return response.data as Interview;
}

/**
 * 删除面试
 * @param id 面试ID
 * @returns 是否删除成功
 */
export async function deleteInterview(id: string): Promise<boolean> {
  const response = await del<null>('INTERVIEW_DELETE', [id]);
  return response.code === 200;
}

/**
 * 删除面试轮次
 * @param id 轮次ID
 * @returns 是否删除成功
 */
export async function deleteInterviewRound(id: string): Promise<boolean> {
  const response = await del<null>('INTERVIEW_ROUND_DELETE', [id]);
  return response.code === 200;
}

/**
 * 使用岗位OCR识别服务
 * @param file 岗位图片文件
 * @returns 识别结果
 */
export async function recognizePositionImage(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('message', POSITION_IMAGE_TO_JSON);
  
  const response = await post<any>(
    'AI_MESSAGE_SEND', 
    formData,
    undefined,
    undefined,
    true
  );
  
  if (response.data?.reply) {
    try {
      return JSON.parse(response.data.reply);
    } catch (e) {
      return null;
    }
  }
  
  return null;
} 