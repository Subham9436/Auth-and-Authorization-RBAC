import type { Context } from "hono";
import {
  assignRolesToUser,
  createRoleWithPermissions,
} from "../authz.service.ts";

export async function createRoleController(c: Context) {
  try {
    const { roleName, permissionIds } = await c.req.json();

    if (!roleName) {
      return c.json({ message: "roleName is required" }, 400);
    }

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      return c.json(
        { message: "At least one permission is required to create a role" },
        400
      );
    }

    // Delegate to service
    const role = await createRoleWithPermissions(roleName, permissionIds);

    return c.json(
      {
        message: "Role created with permissions successfully",
        data: role,
      },
      201
    );
  } catch (error: any) {
    if (error.name === "RoleAlreadyExistsError") {
      return c.json({ message: error.message }, 409);
    }
    return c.json(
      {
        message: "Failed to create role",
      },
      500
    );
  }
}

export async function assignRolesToUserController(c: Context) {
  try {
    const userId = Number(c.req.param("userId"));
    const { roleIds } = await c.req.json();

    if (!userId || !Array.isArray(roleIds)) {
      return c.json({ message: "userId and roleIds[] are required" }, 400);
    }

    await assignRolesToUser(userId, roleIds);

    return c.json({ message: "Roles assigned successfully" }, 200);
  } catch (error: any) {
    return c.json({ message: "Failed to assign roles" }, 500);
  }
}
