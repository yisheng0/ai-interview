import { Metadata } from 'next';
import ThemeProvider from '../providers/ThemeProvider';
import '../globals.css';

/**
 * 认证页面的元数据
 */
export const metadata: Metadata = {
  title: '行向 - 登录',
  description: '行向 应用登录页面',
};

/**
 * 认证页面的布局组件
 * 提供认证相关页面的共享布局
 * @param children 子组件
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 