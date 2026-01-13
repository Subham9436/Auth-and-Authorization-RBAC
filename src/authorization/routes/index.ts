// Route Aggregator for roles and permissions
import { Hono } from "hono";
import roleRouter from "./role.routes.ts";
import permissionRouter from "./permission.route.ts";
import userRoleRoutes from "./user-role.routes.ts";

const authorizationRouter = new Hono();
authorizationRouter.route("/roles", roleRouter);
authorizationRouter.route("/permissions", permissionRouter);
authorizationRouter.route("/users", userRoleRoutes);

export default authorizationRouter;
