// JWT utilities for authentication

import jwt from "jsonwebtoken";
import type { MyJwtPayload } from "../utils/interface.ts";

if (!process.env.JWTPass) {
  throw new Error("JWTPass is not defined in environment variables");
}
const JWTPass: string = process.env.JWTPass;

export function SignJWT(email: string, id: number) {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return null;
    }
    const payLoad = { email, id };
    const token = jwt.sign(payLoad, JWTPass, { expiresIn: "7d" });
    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
}

export function Verify(token: string) {
  try {
    return jwt.verify(token, JWTPass) as MyJwtPayload;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}

export function Decode(token: string): MyJwtPayload | null {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === "string") {
      return null;
    }

    return decoded as MyJwtPayload;
  } catch (err) {
    console.log("error decoding token", err);
    return null;
  }
}
