// Service layer for authorization functions:
// No role is created without permissions

import {
  assignRolesToUserTx,
  createRoleWithPermissionsTx,
  findUserRoleIds,
} from "./authz.repository.ts";

export async function createRoleWithPermissions(
  roleName: string,
  permissionsId: number[]
) {
  try {
    if (!roleName || roleName.trim() === "") {
      const err = new Error("Role name is required");
      (err as any).statusCode = 400;
      throw err;
    }

    if (!permissionsId || permissionsId.length === 0) {
      const err = new Error("At least one permission is required");
      (err as any).statusCode = 400;
      throw err;
    }

    // Delegate to transaction function
    return await createRoleWithPermissionsTx(roleName, permissionsId);
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    const err = new Error("Failed to create role with permissions");
    (err as any).statusCode = 500;
    throw err;
  }
}

// Assign role to user
export async function assignRolesToUser(
  userId: number,
  roleIds: number[]
) {
  try {
    if (!userId || userId <= 0) {
      const err = new Error("Valid userId is required");
      (err as any).statusCode = 400;
      throw err;
    }

    if (!roleIds || roleIds.length === 0) {
      const err = new Error("At least one role must be assigned");
      (err as any).statusCode = 400;
      throw err;
    }

    const existing = await findUserRoleIds(userId);

    if (!existing) {
      const err = new Error("User not found");
      (err as any).statusCode = 404;
      throw err;
    }

    const existingRoleIds = new Set(existing.map((r) => r.roleId));

    const rolesToInsert = roleIds.filter(
      (roleId) => !existingRoleIds.has(roleId)
    );

    if (rolesToInsert.length === 0) {
      const err = new Error("User already has these roles");
      (err as any).statusCode = 409;
      throw err;
    }

    // Delegate to transaction function
    await assignRolesToUserTx(userId, rolesToInsert);
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    console.error("assignRolesToUser Error:", error);
    const err = new Error("Failed to assign roles to user");
    (err as any).statusCode = 500;
    throw err;
  }
}
