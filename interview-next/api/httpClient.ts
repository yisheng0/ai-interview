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
  // 获取API端点定义
  const urlEndpoint = API_ENDPOINTS[endpoint as keyof typeof API_ENDPOINTS];
  
  if (!urlEndpoint) {
    throw new Error(`未找到API端点: ${endpoint}`);
  }
  
  // 处理函数式API端点（如AI_STREAM_MESSAGE）
  if (typeof urlEndpoint === 'function' && params) {
    // 假设函数的第一个参数是会话ID
    if (params.length > 0) {
      return urlEndpoint(params[0]);
    }
    throw new Error(`函数式API端点 ${endpoint} 需要参数`);
  }
  
  // 处理字符串端点
  return urlEndpoint as string;
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
    isFormData = false
  } = options;
  
  // 构建请求头
  const requestHeaders: HeadersInit = {
    ...headers
  };
  
  // 非FormData请求添加Content-Type
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
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
    
    // 检查响应状态
    if (!response.ok) {
      let errorMessage;
      
      try {
        // 尝试解析为JSON
        const errorData = await response.json();
        errorMessage = errorData.message || `服务器响应错误: ${response.status}`;
      } catch (jsonError) {
        // 非JSON响应，获取文本或状态
        try {
          const textError = await response.text();
          errorMessage = textError || `服务器响应错误: ${response.status} ${response.statusText}`;
        } catch (textError) {
          errorMessage = `服务器响应错误: ${response.status} ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    // 尝试解析响应
    let responseData;
    
    try {
      // 尝试获取JSON
      responseData = await response.json();
    } catch (jsonError) {
      clientLogger.error(`解析JSON响应失败:`, jsonError);
      
      // 创建一个基本的成功响应
      responseData = {
        code: response.status,
        data: null,
        message: '服务器返回非JSON响应'
      };
    }
    
    // 应用响应拦截器
    let finalResponseData = responseData;
    for (const interceptor of responseInterceptors) {
      finalResponseData = await interceptor(response, finalResponseData);
    }
    
    return finalResponseData as ServerResponse<T>;
  } catch (error) {
    clientLogger.error(`请求${finalUrl}失败`, error);
    return handleDataFetcherError(error, `请求${finalUrl}`) as ServerResponse<T>;
  }
}

// 添加默认请求拦截器 - 在此处统一处理认证Token
addRequestInterceptor((url, options) => {
  const headers = options.headers as HeadersInit;
      const token = getToken();
      console.log('token', token);
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  
  
  return { url, options: { ...options, headers } };
});

// 添加默认响应拦截器 - 处理401未授权
addResponseInterceptor(async (response, responseData) => {
  // 处理401未授权响应
  if (response.status === 401 || responseData.code === 401) {
    // 清除认证信息
    useAuthStore.getState().clearAuth();
    
    // 重定向到登录页面
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
      window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname);
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
 * HTTP POST请求（支持文件上传）
 * @param endpoint 端点名称
 * @param data 请求数据
 * @param urlParams URL参数
 * @param headers 请求头
 * @param isFileUpload 是否为文件上传请求
 * @returns 服务器响应
 */
export function post<T>(
  endpoint: string, 
  data?: any, 
  urlParams?: any[], 
  headers?: Record<string, string>,
  isFileUpload?: boolean
): Promise<ServerResponse<T>> {
  return request<T>(
    endpoint, 
    { 
      method: 'POST', 
      data, 
      headers, 
      isFormData: isFileUpload 
    }, 
    urlParams
  );
}

/**
 * HTTP PUT请求
 * @param endpoint 端点名称
 * @param data 请求数据
 * @param urlParams URL参数
 * @param headers 请求头
 * @returns 服务器响应
 */
export function put<T>(endpoint: string, data?: any, urlParams?: any[], headers?: Record<string, string>): Promise<ServerResponse<T>> {
  return request<T>(endpoint, { method: 'PUT', data, headers }, urlParams);
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

export default {
  get,
  post,
  put,
  del,
  addRequestInterceptor,
  addResponseInterceptor
};