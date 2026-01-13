import { prisma } from "../prisma.ts";
import { Prisma } from "@prisma/client";
import type { ICreateUser } from "./utils/interface.ts";

// Custom Error Classes-----!!
export class RepositoryError extends Error {
  code: string;
  constructor(message: string, code = "REPOSITORY_ERROR") {
    super(message);
    this.code = code;
  }
}

export class NotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message, "NOT_FOUND");
  }
}

export class ConflictError extends RepositoryError {
  constructor(message: string) {
    super(message, "CONFLICT");
  }
}
// -----------------------------

export async function createUserWithRole(
  userData: ICreateUser,
  roleName: string
) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch role
      const role = await tx.roles.findUnique({
        where: { roleName },
      });

      if (!role) {
        throw new NotFoundError(`Role '${roleName}' not found`);
      }

      // 2. Create user
      const user = await tx.user.create({
        data: userData,
      });

      // 3. Assign role
      await tx.user_Roles.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });

      return user;
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictError("User already exists");
      }
    }

    if (error instanceof RepositoryError) {
      throw error;
    }
  // Unexpected errors
  throw new RepositoryError("Failed to create user with role");
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error("findUserByEmail Error:", error);
    throw new RepositoryError("Failed to fetch user by email");
  }
}
