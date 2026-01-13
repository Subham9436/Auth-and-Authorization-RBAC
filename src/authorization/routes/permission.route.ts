// src/authorization/routes/permission.route.ts
import { Hono } from "hono";
import {
  createPermissionController,
  deletePermissionController,
} from "../controllers/permission.controller.ts";
const permissionRouter = new Hono();

// POST /permissions - Create a new permission
permissionRouter.post("/", createPermissionController);

// DELETE /permissions/:permissionId - Delete a permission
permissionRouter.delete(
  "/:permissionId",
  deletePermissionController
);

export default permissionRouter;
