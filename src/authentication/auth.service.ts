import bcrypt from "bcryptjs";
import { type ICreateUser } from "./utils/interface.ts";
import { comparePassword } from "./utils/password.ts";
import { createUserWithRole, findUserByEmail } from "./auth.repository.ts";
import { SignJWT } from "./utils/jwt.ts";


const ALLOWED_SIGNUP_ROLES = new Set(["TEMP_USER", "USER"]);
export const signupService = async (
  userData: ICreateUser,
  roleName: string
) => {
  try {
    if (!ALLOWED_SIGNUP_ROLES.has(roleName)) {
      throw new Error("INVALID_ROLE");
    }

    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("USER_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await createUserWithRole(
      { ...userData, password: hashedPassword },
      roleName
    );

    const token = SignJWT(user.email, user.id);

    return { user, token };
  } catch (err: any) {
    switch (err.message) {
      case "INVALID_ROLE":
        throw new Error("Invalid role for signup");
      case "USER_EXISTS":
        throw new Error("User already exists");
      default:
        throw new Error("Something went wrong. Please try again.");
    }
  }
};

export async function loginUser(email: string, password: string) {
  try {
    const user = await findUserByEmail(email);
    if (!user) throw new Error("AUTH_FAILED");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("AUTH_FAILED");

    const token = SignJWT(user.email, user.id);
    return { token };
  } catch (err: any) {
    if (err.message === "AUTH_FAILED") {
      throw new Error("Invalid email or password");
    }

    throw new Error("Unable to login. Please try again later.");
  }
}

export const logoutService = () => {
  // Logout logic in services is usually minimal as
  // the controller handles cookie deletion.
  return { success: true };
};
