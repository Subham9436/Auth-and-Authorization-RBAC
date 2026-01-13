import type { JwtPayload } from "jsonwebtoken";

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface MyJwtPayload extends JwtPayload {
  username: string;
  id?: number;
}
