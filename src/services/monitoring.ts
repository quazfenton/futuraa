import config from '@/config';

interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
}

class MonitoringService {
  private enabled: boolean;
  private logs: LogEvent[] = [];
  private maxLogs: number = 1000;

  constructor() {
    this.enabled = config.environment !== 'development' || config.debug;
  }

  log(level: LogEvent['level'], message: string, context?: Record<string, any>) {
    if (!this.enabled) {
      // In development, still log to console
      console[level](message, context);
      return;
    }

    const logEvent: LogEvent = {
      level,
      message,
      timestamp: new Date(),
      context: { ...context, environment: config.environment }
    };

    // Add to internal logs
    this.logs.push(logEvent);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Send to external service in production
    if (config.environment === 'production') {
      this.sendToExternalService(logEvent);
    }

    // Also log to console
    console[level](message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    if (config.debug) {
      this.log('debug', message, context);
    }
  }

  private sendToExternalService(logEvent: LogEvent) {
    // In a real implementation, send to external monitoring service
    // e.g., Sentry, LogRocket, etc.
    console.log('Would send to external service:', logEvent);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  // Performance monitoring
  measurePerformance(taskName: string, task: () => any) {
    const start = performance.now();
    try {
      const result = task();
      const end = performance.now();
      this.info(`${taskName} completed`, {
        duration: `${end - start}ms`,
        memory: (performance as any).memory ? {
          used: (performance as any).memory.usedJSHeapSize,
          total: (performance as any).memory.totalJSHeapSize,
        } : undefined
      });
      return result;
    } catch (error) {
      const end = performance.now();
      this.error(`${taskName} failed`, {
        duration: `${end - start}ms`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService();