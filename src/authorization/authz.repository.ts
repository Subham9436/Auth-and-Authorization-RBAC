import { prisma } from "../prisma.ts";
import { Prisma } from "@prisma/client";
import {
  DatabaseOperationError,
  MissingPermissionNameError,
  MissingRoleNameError,
  PermissionAlreadyDeletedError,
  PermissionAlreadyExistsError,
  PermissionNotFoundError,
  RoleAlreadyExistsError,
  ValidationError,
} from "../shared/errors/auth.error.ts";

export async function createRole(roleName: string) {
  if (!roleName || roleName.trim() === "") {
    throw new MissingRoleNameError();
  }

  try {
    return await prisma.roles.create({
      data: { roleName },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new RoleAlreadyExistsError(roleName);
    }

    throw new DatabaseOperationError("Failed to create role");
  }
}

export async function createPermissions(permission: string) {
  if (!permission || permission.trim() === "") {
    throw new MissingPermissionNameError();
  }

  try {
    return await prisma.permissions.create({
      data: {
        permissions: permission,
        isActive: true,
        isDeleted: false,
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new PermissionAlreadyExistsError(permission);
    }

    throw new Error("Failed to create permission");
  }
}

export async function deletePermission(permissionId: number) {
  const permission = await prisma.permissions.findUnique({
    where: { id: permissionId },
  });

  if (!permission) {
    throw new PermissionNotFoundError();
  }

  if (permission.isDeleted) {
    throw new PermissionAlreadyDeletedError();
  }

  return prisma.permissions.update({
    where: { id: permissionId },
    data: { isDeleted: true },
  });
}

// Populate user with roles
export async function assignRoleToUser(userId: number, roleId: number) {
  try {
    return await prisma.user_Roles.create({
      data: { userId, roleId },
    });
  } catch (error) {
    throw new Error("Failed to assign role to user");
  }
}
export async function createRoleWithPermissionsTx(
  roleName: string,
  permissionsId: number[]
) {
  try {
    return await prisma.$transaction(async (tx) => {
      const role = await tx.roles.create({
        data: { roleName },
      });

      for (const permissionId of permissionsId) {
        await tx.roles_Permissions.create({
          data: {
            roleId: role.id,
            permissionId,
          },
        });
      }

      return role;
    });
  } catch (error: unknown) {
    console.log("createRoleWithPermissionsTx Error:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new RoleAlreadyExistsError(roleName);
    }

    throw error;
  }
}

// Fetch roleIds already assigned to user
export async function findUserRoleIds(userId: number) {
  if (!userId || userId <= 0) {
    throw new Error("Valid userId is required");
  }

  try {
    return await prisma.user_Roles.findMany({
      where: { userId },
      select: { roleId: true },
    });
  } catch (error) {
    throw new Error("Failed to fetch user roles");
  }
}

// Assign multiple roles to a user in a transaction
export async function assignRolesToUserTx(userId: number, roleIds: number[]) {
  if (!roleIds || roleIds.length === 0) {
    throw new Error("At least one role is required");
  }

  try {
    return await prisma.$transaction(
      roleIds.map((roleId) =>
        prisma.user_Roles.create({
          data: { userId, roleId },
        })
      )
    );
  } catch (error) {
    throw new Error("Failed to assign roles to user");
  }
}
