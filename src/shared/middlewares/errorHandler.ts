import type { Context } from "hono";
import { AppError } from "../errors/base-app.error.ts";
import { requestContext } from "../utils/request-context.ts";
import { logger } from "../utils/logger.ts";

export const errorHandler = (err: unknown, c: Context) => {
  const ctx = requestContext.getStore();

  logger.error("Unhandled error", {
    requestId: ctx?.requestId,
    path: c.req.path,
    method: c.req.method,
    error: err,
  });

  if (err instanceof AppError) {
    logger.warn("Operational error", {
      requestId: ctx?.requestId,
      errorCode: err.errorCode,
      statusCode: err.statusCode,
    });

    return c.json(
      {
        success: false,
        message: err.message,
        errorCode: err.errorCode,
        requestId: ctx?.requestId,
      },
      err.statusCode
    );
  }

  return c.json(
    {
      success: false,
      message: "Internal server error",
      errorCode: "INTERNAL_001",
      requestId: ctx?.requestId,
    },
    500
  );
};
