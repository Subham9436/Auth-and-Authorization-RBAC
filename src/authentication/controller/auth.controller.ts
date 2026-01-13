// src/authentication/controller.ts
import { type Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { loginUser, signupService } from "../auth.service.ts";
import { loginSchema, signupSchema } from "../utils/types.ts";

export const signupHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { name, email, password, rolename } = body;
    const role = rolename?.trim() || "TEMP_USER";

    // Validate normalized payload
    const parsedPayload = signupSchema.safeParse({
      name,
      email,
      password,
      rolename: role,
    });
    console.log("Signup Payload Validation Result:", parsedPayload);
    if (!parsedPayload.success) {
      return c.json(
        { error: "Invalid input", details: parsedPayload.error },
        400
      );
    }

    // Call service (service handles hashing + repo transaction)
    const result = await signupService({ name, email, password }, role);

    return c.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          user: result.user,
          token: result.token,
        },
      },
      201
    );
  } catch (error) {
    return c.json({ success: false, message: "Registration failed" }, 500);
  }
};

export const loginHandler = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const parsedPayload = loginSchema.safeParse({ email, password });
    if (!parsedPayload.success) {
      return c.json(
        { error: "Invalid input", details: parsedPayload.error },
        400
      );
    }
    if (!email || !password) {
      return c.json({ message: "email and password required" }, 400);
    }
    // delegate to service
    const result = await loginUser(email, password);
    return c.json({ success: true, token: result.token }, 200);
  } catch (error) {
    return c.json({ success: false, message: "Bad Request" }, 400);
  }
};

export const logoutHandler = async (c: Context) => {
  // Clear the authentication cookie
  deleteCookie(c, "auth_token");

  return c.json({ success: true, message: "Logged out successfully" });
};
