import { AppError } from "./base-app.error.ts";

/* =====================================================
   400 — VALIDATION ERRORS
===================================================== */

export class ValidationError extends AppError {
  constructor(message = "Invalid request data") {
    super(message, 400, "VALIDATION_001");
  }
}

export class MissingRoleNameError extends AppError {
  constructor() {
    super("Role name is required", 400, "VALIDATION_ROLE_001");
  }
}

export class MissingPermissionNameError extends AppError {
  constructor() {
    super("Permission is required", 400, "VALIDATION_PERM_001");
  }
}

export class InvalidIdError extends AppError {
  constructor(entity: string) {
    super(`Valid ${entity} id is required`, 400, "VALIDATION_ID_001");
  }
}

export class EmptyRoleListError extends AppError {
  constructor() {
    super("At least one role is required", 400, "VALIDATION_ROLE_002");
  }
}

/* =====================================================
   404 — NOT FOUND (RBAC)
===================================================== */

export class RoleNotFoundError extends AppError {
  constructor() {
    super("Role not found", 404, "AUTHZ_ROLE_404");
  }
}

export class PermissionNotFoundError extends AppError {
  constructor() {
    super("Permission not found", 404, "AUTHZ_PERM_404");
  }
}

/* =====================================================
   409 — CONFLICT (RBAC)
===================================================== */

export class RoleAlreadyExistsError extends AppError {
  constructor(roleName: string) {
    super(
      `Role '${roleName}' already exists`,
      409,
      "AUTHZ_ROLE_409"
    );
  }
}

export class PermissionAlreadyExistsError extends AppError {
  constructor(permission: string) {
    super(
      `Permission '${permission}' already exists`,
      409,
      "AUTHZ_PERM_409"
    );
  }
}

export class PermissionAlreadyDeletedError extends AppError {
  constructor() {
    super(
      "Permission already deleted",
      409,
      "AUTHZ_PERM_410"
    );
  }
}

/* =====================================================
   422 — SEMANTIC / BUSINESS LOGIC ERRORS
===================================================== */

export class RoleAssignmentError extends AppError {
  constructor() {
    super(
      "Failed to assign role to user",
      422,
      "AUTHZ_ASSIGN_001"
    );
  }
}

export class MultipleRoleAssignmentError extends AppError {
  constructor() {
    super(
      "Failed to assign roles to user",
      422,
      "AUTHZ_ASSIGN_002"
    );
  }
}

export class RolePermissionTransactionError extends AppError {
  constructor() {
    super(
      "Failed to create role with permissions",
      422,
      "AUTHZ_TX_001"
    );
  }
}

/* =====================================================
   500 — INTERNAL / DATABASE
===================================================== */

export class DatabaseOperationError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, "DB_001", false);
  }
}
