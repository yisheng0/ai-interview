import { clientLogger } from './logger';

/**
 * 自定义未授权错误
 */
export class UnauthorizedError extends Error {
  constructor(message = '未授权') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 服务器响应错误
 */
export class ServerResponseError extends Error {
  private httpCode: number;
  private responseText: string;

  constructor(httpCode: number, responseText: string) {
    super(`HTTP ${httpCode}: ${responseText}`);
    this.name = 'ServerResponseError';
    this.httpCode = httpCode;
    this.responseText = responseText;
  }

  getHttpCode(): number {
    return this.httpCode;
  }

  getResponseText(): string {
    return this.responseText;
  }
}

/**
 * HTTP状态码枚举
 */
export enum HttpStatusCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500
}

/**
 * 服务器响应基本结构
 */
export interface ServerResponseBase {
  code: number;
  message: string;
}

/**
 * 服务器响应完整结构
 */
export interface ServerResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 类型保护：判断对象是否为ServerResponseBase类型
 */
export function isServerResponseBase(obj: any): obj is ServerResponseBase {
  return (
    obj &&
    typeof obj === 'object' &&
    'code' in obj &&
    typeof obj.code === 'number' &&
    'message' in obj &&
    typeof obj.message === 'string'
  );
}

/**
 * 处理异常并抛出统一格式的错误
 * @param error 捕获到的错误
 * @param logPrefix 日志前缀
 * @returns 统一处理后的错误响应
 */
export function handleDataFetcherError(
  error: unknown,
  logPrefix: string
): ServerResponse<undefined> {
  // 记录错误日志
  clientLogger.error(`${logPrefix}出错`, error);

  // 处理未授权错误
  if (error instanceof UnauthorizedError) {
    return {
      code: HttpStatusCode.Unauthorized,
      message: '未授权',
      data: undefined,
    };
  }

  // 处理服务器响应错误
  if (error instanceof ServerResponseError) {
    const httpCode = error.getHttpCode();
    const responseText = error.getResponseText();
    const serverResponse = createServerResponse(httpCode, responseText);

    if (serverResponse.code !== httpCode) {
      return {
        code: serverResponse.code,
        message: serverResponse.message,
        data: undefined,
      };
    } else {
      return {
        code: serverResponse.code,
        message: '请求失败',
        data: undefined,
      };
    }
  }

  // 处理其他类型错误
  return {
    code: HttpStatusCode.InternalServerError,
    message: '请求失败',
    data: undefined,
  };
}

/**
 * 创建标准的服务器响应对象
 */
function createServerResponse(httpCode: number, responseText: string): ServerResponseBase {
  try {
    const parsedJson = JSON.parse(responseText);
    if (isServerResponseBase(parsedJson)) {
      return parsedJson;
    }
  } catch {
    // 解析失败时使用默认响应
  }

  return {
    code: httpCode,
    message: responseText,
  };
}