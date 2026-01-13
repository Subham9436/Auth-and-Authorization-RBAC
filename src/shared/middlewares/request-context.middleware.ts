import type { Context, Next } from "hono";
import { randomUUID } from "node:crypto";
import { requestContext } from "../utils/request-context.ts";

export const requestContextMiddleware = async (
  c: Context,
  next: Next
) => {
  const requestId = randomUUID();

  return requestContext.run({ requestId }, async () => {
    c.set("requestId", requestId);
    await next();
  });
};
