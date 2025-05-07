import ResumeClient from './client';

/**
 * 添加动态渲染配置
 */
export const dynamic = 'force-dynamic';

/**
 * 简历编辑页面 - 服务端组件
 * 负责获取初始数据并传递给客户端组件
 * 未来可以添加认证检查和API调用
 */
export default async function ResumePage() {
  // 这里可以添加服务端数据获取逻辑
  // 例如: const initialData = await fetchUserResume();
  
  // 暂时返回空数据，未来会从API获取
  const initialData = null;
  
  return <ResumeClient initialData={initialData} />;
} 