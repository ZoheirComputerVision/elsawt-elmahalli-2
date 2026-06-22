type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  requestId?: string;
}

class Logger {
  private requestId: string;

  constructor() {
    this.requestId = crypto.randomUUID?.() ?? Date.now().toString(36);
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data: data ?? undefined,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
    };

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case "error":
        console.error(prefix, message, data ?? "");
        break;
      case "warn":
        console.warn(prefix, message, data ?? "");
        break;
      case "debug":
        if (process.env.NODE_ENV !== "production") {
          console.debug(prefix, message, data ?? "");
        }
        break;
      default:
        console.log(prefix, message, data ?? "");
    }
  }

  debug(message: string, data?: unknown) {
    this.log("debug", message, data);
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data);
  }

  error(message: string, data?: unknown) {
    this.log("error", message, data);
  }

  child(ctx: Record<string, unknown>): Logger {
    const child = new Logger();
    child.info = (msg: string, data?: unknown) => this.info(msg, { ...ctx, ...(data as Record<string, unknown>) });
    child.error = (msg: string, data?: unknown) => this.error(msg, { ...ctx, ...(data as Record<string, unknown>) });
    child.warn = (msg: string, data?: unknown) => this.warn(msg, { ...ctx, ...(data as Record<string, unknown>) });
    child.debug = (msg: string, data?: unknown) => this.debug(msg, { ...ctx, ...(data as Record<string, unknown>) });
    return child;
  }
}

export const logger = new Logger();
