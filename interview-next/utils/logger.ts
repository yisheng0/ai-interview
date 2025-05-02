type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * 日志消息类型
 */
interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  data?: unknown;
}

/**
 * 日志类
 */
class Logger {
  private static formatMessage(level: LogLevel, message: string, data?: unknown): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: data,
    };
  }

  private static log(level: LogLevel, message: string, data?: unknown) {
    const logMessage = this.formatMessage(level, message, data);

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV !== 'production') {
      const color = {
        debug: '\x1b[34m', // 蓝色
        info: '\x1b[32m', // 绿色
        warn: '\x1b[33m', // 黄色
        error: '\x1b[31m', // 红色
      }[level];

      // eslint-disable-next-line no-console
      console.log(
        `${color}[${logMessage.timestamp}][${level.toUpperCase()}]${logMessage.requestId ? `[${logMessage.requestId}]` : ''} ${message}\x1b[0m`,
        data ? data : ''
      );
    } else {
      // 生产环境下可以将日志发送到日志服务
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(logMessage));
    }
  }

  static debug(message: string, data?: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      this.log('debug', message, data);
    }
  }

  static info(message: string, data?: unknown) {
    this.log('info', message, data);
  }

  static warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }

  static error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}

/**
 * 服务端日志
 */
export const serverLogger = Logger;

/**
 * 客户端日志
 */
export const clientLogger = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, data);
    }
  },
  warn: (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, data);
  },
  error: (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, data);
  },
};
