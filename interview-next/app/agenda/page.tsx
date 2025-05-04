import InterviewAgendaClientModule from './client';

/**
 * 添加动态渲染配置
 */
export const dynamic = 'force-dynamic';

/**
 * 面试日程页面 - Web版
 * @returns 面试日程页面组件
 */
export default async function InterviewAgendaPage() {
  // 模拟数据 - 后续会接入真实API
  const interviewList = [];
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