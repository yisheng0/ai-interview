import InterviewSessionClientModule from './client';

/**
 * 添加动态渲染配置
 * https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
 */
export const dynamic = 'force-dynamic';

/**
 * url参数列表类型
 */
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * 面试会话页面
 *
 * @param searchParams 查询参数，包含sessionUuid
 * @returns 面试会话客户端组件
 */
export default async function InterviewSessionPage({ searchParams }: Props) {
  const sessionUuid = (await searchParams)['session'] as string;
  const interviewId = (await searchParams)['interview'] as string;
  const roundId = (await searchParams)['round'] as string;

  return (
    <InterviewSessionClientModule
      sessionUuid={sessionUuid}
      interviewId={interviewId}
      roundId={roundId}
    />
  );
}