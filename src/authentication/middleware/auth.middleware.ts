import type { Context, Next } from "hono";
import { Verify } from "../utils/jwt.ts";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = Verify(token);
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
}