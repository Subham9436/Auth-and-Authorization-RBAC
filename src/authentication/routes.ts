// Routes for authentication-related endpoints
import { Hono } from "hono";
import {
  loginHandler,
  logoutHandler,
  signupHandler,
} from "./controller/auth.controller.ts";

const auth = new Hono();

// POST /authentication/login
auth.post("/login", loginHandler);

// POST /authentication/logout
auth.post("/logout", logoutHandler);

auth.post("/signup", signupHandler);

export default auth;
