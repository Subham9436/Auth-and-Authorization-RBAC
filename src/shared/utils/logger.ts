import { requestContext } from "./request-context.ts";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  level: LogLevel;
  message: string;
  requestId?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private log(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>
  ) {
    const ctx = requestContext.getStore();
    const requestId = ctx?.requestId;
    const payload: LogPayload = {
      level,
      message,
      requestId,
      meta,
      timestamp: new Date().toISOString(),
    };

    console[level](JSON.stringify(payload));
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log("error", message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, meta);
    }
  }
}

export const logger = new Logger();
