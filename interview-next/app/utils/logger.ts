/**
 * 客户端日志工具
 * 提供客户端日志记录功能，便于跟踪和调试
 */

/**
 * 日志级别
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * 客户端日志记录器
 */
class ClientLogger {
  /**
   * 记录信息级别的日志
   * @param message 日志消息
   * @param optionalParams 其他参数
   */
  info(message: string, ...optionalParams: any[]): void {
    this.log('info', message, ...optionalParams);
  }

  /**
   * 记录警告级别的日志
   * @param message 日志消息
   * @param optionalParams 其他参数
   */
  warn(message: string, ...optionalParams: any[]): void {
    this.log('warn', message, ...optionalParams);
  }

  /**
   * 记录错误级别的日志
   * @param message 日志消息
   * @param optionalParams 其他参数
   */
  error(message: string, ...optionalParams: any[]): void {
    this.log('error', message, ...optionalParams);
  }

  /**
   * 记录调试级别的日志
   * @param message 日志消息
   * @param optionalParams 其他参数
   */
  debug(message: string, ...optionalParams: any[]): void {
    this.log('debug', message, ...optionalParams);
  }

  /**
   * 通用日志记录方法
   * @param level 日志级别
   * @param message 日志消息
   * @param optionalParams 其他参数
   */
  private log(level: LogLevel, message: string, ...optionalParams: any[]): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    // 生产环境可以配置是否输出或发送到服务端
    if (process.env.NODE_ENV !== 'production' || level === 'error') {
      switch (level) {
        case 'info':
          console.info(`${prefix} ${message}`, ...optionalParams);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`, ...optionalParams);
          break;
        case 'error':
          console.error(`${prefix} ${message}`, ...optionalParams);
          break;
        case 'debug':
          console.debug(`${prefix} ${message}`, ...optionalParams);
          break;
      }
    }
    
    // TODO: 在生产环境中，可以添加将日志发送到服务端的逻辑
  }
}

// 导出单例实例
export const clientLogger = new ClientLogger(); 