import type { Context } from "hono";
import { createPermissions, deletePermission } from "../authz.repository.ts";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "../../shared/errors/index.ts";

export async function createPermissionController(c: Context) {
  const { permission } = await c.req.json();

  if (!permission) {
    return c.json(
      { message: "Permission is required" },
      StatusCodes.BAD_REQUEST
    );
  }

  const result = await createPermissions(permission);

  return c.json(
    { message: "Permission created", data: result },
    StatusCodes.CREATED
  );
}

export async function deletePermissionController(c: Context) {
  const permissionId = Number(c.req.param("permissionId"));

  if (!Number.isInteger(permissionId) || permissionId <= 0) {
    throw new ValidationError("Valid permissionId is required");
  }

  await deletePermission(permissionId);

  return c.json({ message: "Permission deleted" });
}
