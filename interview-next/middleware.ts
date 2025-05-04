import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from './utils/jwt';
import { clientLogger } from './utils/logger';

/**
 * Next.js中间件函数
 * 用于路由保护和Token验证
 * @param request NextRequest对象
 * @returns NextResponse对象
 */
export function middleware(request: NextRequest) {
  // 获取当前路径
  const { pathname } = request.nextUrl;
  
  // 不需要验证的路径列表
  const publicPaths = [
    '/auth',             // 登录页
    '/api/auth',         // 认证相关API
    '/_next',            // Next.js静态资源
    '/favicon.ico',      // 网站图标
    '/public'            // 公开资源
  ];
  
  // 检查当前路径是否是公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // 如果是公开路径，直接通过
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  try {
    // 从Cookie中获取token - 与authStore保持同步
    const token = request.cookies.get('auth-token')?.value;
    
    // 如果没有token或token已过期，重定向到登录页
    if (!token || isTokenExpired(token)) {
      // 记录日志
      clientLogger.warn(`访问受保护路径${pathname}，但token${!token ? '不存在' : '已过期'}`);
      
      // 构建重定向URL，将当前URL作为redirect参数
      const redirectUrl = new URL('/auth');
      // const redirectUrl = new URL('/auth', request.url);
      // redirectUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(redirectUrl);
    }
    
    // Token有效，允许访问
    return NextResponse.next();
  } catch (error) {
    // 处理异常情况
    clientLogger.error('中间件验证Token时出错', error);
    
    // 发生错误时，重定向到登录页
    const redirectUrl = new URL('/auth', request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

/**
 * 配置中间件匹配的路径
 */
export const config = {
  // 匹配所有路径，但排除特定路径
  matcher: [
    // 匹配主要应用路径
    '/',
    '/agenda/:path*',
    '/reports/:path*',
    '/session/:path*',
    // 排除不需要验证的路径
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico|public).*)'
  ],
}; 