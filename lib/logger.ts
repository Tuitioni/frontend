type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
  if (entry.context && Object.keys(entry.context).length > 0) {
    return `${base} ${JSON.stringify(entry.context)}`;
  }
  return base;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('info', message, context);
    if (process.env.NODE_ENV !== 'test') {
      console.log(formatLog(entry));
    }
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('warn', message, context);
    if (process.env.NODE_ENV !== 'test') {
      console.warn(formatLog(entry));
    }
  },

  error(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('error', message, context);
    if (process.env.NODE_ENV !== 'test') {
      console.error(formatLog(entry));
    }
  },
};
