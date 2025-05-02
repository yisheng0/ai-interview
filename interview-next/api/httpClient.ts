import { API_ENDPOINTS } from './apiEndpoints';
import { clientLogger } from '../utils/logger';
import { handleDataFetcherError, ServerResponse } from '../utils/exception-handler';
import { useAuthStore } from '../state';

/**
 * 请求参数类型
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
  skipAuth?: boolean; // 是否跳过认证
}

/**
 * 请求拦截器类型
 */
type RequestInterceptor = (
  url: string,
  options: RequestInit
) => { url: string; options: RequestInit };

/**
 * 响应拦截器类型
 */
type ResponseInterceptor = (
  response: Response,
  responseData: any
) => Promise<any>;

// 拦截器集合
const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

/**
 * 添加请求拦截器
 * @param interceptor 拦截器函数
 */
export function addRequestInterceptor(interceptor: RequestInterceptor): void {
  requestInterceptors.push(interceptor);
}

/**
 * 添加响应拦截器
 * @param interceptor 拦截器函数
 */
export function addResponseInterceptor(interceptor: ResponseInterceptor): void {
  responseInterceptors.push(interceptor);
}

/**
 * 获取认证token
 * @returns 认证token
 */
const getToken = (): string | null => {
  // 从authStore获取token
  return useAuthStore.getState().token;
};

/**
 * 获取API端点URL
 * @param endpoint 端点名称
 * @param params URL参数
 * @returns 完整URL
 */
function getEndpointUrl(endpoint: string, params?: any[]): string {
  const url = API_ENDPOINTS[endpoint as keyof typeof API_ENDPOINTS];
  
  if (!url) {
    throw new Error(`未找到API端点: ${endpoint}`);
  }
  
  return url;
}

/**
 * 基础HTTP请求函数
 * @param endpoint 端点名称
 * @param options 请求选项
 * @param urlParams URL参数
 * @returns 服务器响应
 */
async function request<T>(
  endpoint: string, 
  options: RequestOptions = {}, 
  urlParams?: any[]
): Promise<ServerResponse<T>> {
  const url = getEndpointUrl(endpoint, urlParams);
  const { 
    method = 'GET', 
    data, 
    headers = {}, 
    isFormData = false,
    skipAuth = false
  } = options;
  
  // 构建请求头
  const requestHeaders: HeadersInit = {
    ...headers
  };
  
  // 非FormData请求添加Content-Type
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  
  // 添加认证Token（除非明确跳过）
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }
  
  // 构建请求选项
  let requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // 包含cookies
  };
  
  // 添加请求体
  if (data) {
    if (isFormData) {
      requestOptions.body = data; // FormData直接作为body
    } else if (method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }
  }
  
  // 应用请求拦截器
  let finalUrl = url;
  for (const interceptor of requestInterceptors) {
    const result = interceptor(finalUrl, requestOptions);
    finalUrl = result.url;
    requestOptions = result.options;
  }
  
  try {
    // 发送请求
    const response = await fetch(finalUrl, requestOptions);
    
    // 解析响应
    const responseData = await response.json();
    
    // 应用响应拦截器
    let finalResponseData = responseData;
    for (const interceptor of responseInterceptors) {
      finalResponseData = await interceptor(response, finalResponseData);
    }
    
    // 请求成功但业务逻辑可能有错误
    if (!response.ok) {
      throw new Error(finalResponseData.message || '请求失败');
    }
    
    return finalResponseData as ServerResponse<T>;
  } catch (error) {
    clientLogger.error(`请求${finalUrl}失败`, error);
    return handleDataFetcherError(error, `请求${finalUrl}`) as ServerResponse<T>;
  }
}

// 添加默认请求拦截器 - 可以在此处添加全局请求头等
addRequestInterceptor((url, options) => {
  // 这里可以添加全局请求头或修改请求参数
  return { url, options };
});

// 添加默认响应拦截器 - 处理401未授权
addResponseInterceptor(async (response, responseData) => {
  // 处理401未授权响应
  if (response.status === 401 || responseData.code === 401) {
    // 清除认证信息
    useAuthStore.getState().clearAuth();
    
    // 重定向到登录页面
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }
  }
  
  return responseData;
});

/**
 * HTTP GET请求
 * @param endpoint 端点名称
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function get<T>(endpoint: string, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'GET', headers }, urlParams);
}

/**
 * HTTP POST请求
 * @param endpoint 端点名称
 * @param data 请求数据
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function post<T>(endpoint: string, data?: any, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'POST', data, headers }, urlParams);
}

/**
 * HTTP DELETE请求
 * @param endpoint 端点名称
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function del<T>(endpoint: string, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'DELETE', headers }, urlParams);
}

/**
 * 不带认证的GET请求（用于登录等不需要token的请求）
 * @param endpoint 端点名称
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function publicGet<T>(endpoint: string, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'GET', headers, skipAuth: true }, urlParams);
}

/**
 * 不带认证的POST请求（用于登录等不需要token的请求）
 * @param endpoint 端点名称
 * @param data 请求数据
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function publicPost<T>(endpoint: string, data?: any, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'POST', data, headers, skipAuth: true }, urlParams);
}

export default {
  get,
  post,
  del,
  publicGet,
  publicPost,
  addRequestInterceptor,
  addResponseInterceptor
};