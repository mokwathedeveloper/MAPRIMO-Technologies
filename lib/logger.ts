export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error | unknown;
}

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log('info', message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    log('warn', message, context);
  },
  error: (message: string, error?: unknown, context?: Record<string, any>) => {
    log('error', message, context, error);
  },
  debug: (message: string, context?: Record<string, any>) => {
    if (!isProduction) {
      log('debug', message, context);
    }
  },
};

function log(level: LogLevel, message: string, context?: Record<string, any>, error?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };

  if (error instanceof Error) {
    entry.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  } else if (error) {
    entry.error = error;
  }

  // In production, we might want to send this to a service (e.g., Datadog, CloudWatch)
  // For now, we print JSON to stdout/stderr which is standard for containerized apps
  const output = JSON.stringify(entry);

  /* eslint-disable no-console */
  if (level === 'error') {
    logger.error(output);
  } else {
    logger.info(output);
  }
  /* eslint-enable no-console */
}
