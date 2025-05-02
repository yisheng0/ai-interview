/**
 * MCP (My Coding Progress) - 日报记录工具
 */

interface DailyReport {
  date: string;
  summary: string;
  tasks: string[];
}

let reports: DailyReport[] = [];

/**
 * 写入日报内容
 * @param summary 日报总结
 * @param tasks 完成的任务列表
 */
export function writeDailyReport(summary: string, tasks: string[] = []): void {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // 格式如：2023-11-18
  
  const newReport: DailyReport = {
    date: dateStr,
    summary,
    tasks,
  };
  
  reports.push(newReport);
  console.log(`✅ 日报已记录 - ${dateStr}`);
  
  // 在开发环境中显示日报内容
  if (process.env.NODE_ENV === 'development') {
    console.log('----- 日报内容 -----');
    console.log(`日期: ${dateStr}`);
    console.log(`总结: ${summary}`);
    if (tasks.length > 0) {
      console.log('任务:');
      tasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task}`);
      });
    }
    console.log('-------------------');
  }
}

/**
 * 获取所有日报
 */
export function getAllReports(): DailyReport[] {
  return [...reports];
}

/**
 * 获取最新的日报
 */
export function getLatestReport(): DailyReport | null {
  return reports.length > 0 ? reports[reports.length - 1] : null;
} 