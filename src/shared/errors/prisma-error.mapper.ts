import { Prisma } from "@prisma/client";
import { ConflictError, NotFoundError } from "../../authentication/auth.repository.ts";
import { ValidationError } from "./auth.error.ts";




export const mapPrismaError = (err: unknown): never => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        throw new ConflictError("Unique constraint violation");

      case "P2025":
        throw new NotFoundError("Record not found");

      default:
        throw new ValidationError("Database request error");
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    throw new ValidationError("Invalid database query");
  }

  throw err;
};
