import http from '../httpClient';
import { ServerResponse } from '@/utils/exception-handler';
import { useAuthStore } from '@/state';

/**
 * 用户信息接口
 */
export interface UserInfo {
  userId: string;
  username: string;
  token: string;
  isNewUser: boolean;
}

/**

  /**
   * 用户登录或注册
   * @param username 用户名
   * @param password 密码
   * @returns 用户信息响应
   */
  function loginOrRegister(username: string, password: string): Promise<ServerResponse<UserInfo>> {
    return http.post<UserInfo>('AUTH_LOGIN_OR_REGISTER', { username, password });
  }
  
  /**
   * 获取当前用户信息
   * @returns 用户信息响应
   */
  function getUserInfo(): Promise<ServerResponse<UserInfo>> {
    // 使用带认证的请求
    return http.get<UserInfo>('AUTH_USER_INFO');
  }


export { loginOrRegister, getUserInfo };