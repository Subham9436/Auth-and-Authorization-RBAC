import type { ContentfulStatusCode } from "hono/utils/http-status";

export abstract class AppError extends Error {
  public readonly statusCode: ContentfulStatusCode;
  public readonly errorCode: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: ContentfulStatusCode,
    errorCode: string,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
