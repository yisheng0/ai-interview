import InterviewAgendaClientModule from './client';
import { getInterviewList } from '@/api/services/interviewService';

/**
 * 添加动态渲染配置
 */
export const dynamic = 'force-dynamic';

/**
 * 面试日程页面 - Web版
 * @returns 面试日程页面组件
 */
export default async function InterviewAgendaPage() {
  // 获取面试列表数据
  const interviewList = await getInterviewList();
  
  // TODO: 后续接入简历和余额相关API
  const resumeInfo = null;
  const interviewBalanceInfo = { balance: 0 };

  return (
    <InterviewAgendaClientModule
      interviewList={interviewList}
      resumeInfo={resumeInfo}
      interviewBalanceInfo={interviewBalanceInfo}
    />
  );
}