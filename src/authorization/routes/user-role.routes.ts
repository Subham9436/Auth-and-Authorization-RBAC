import { Hono } from "hono";
import { assignRolesToUserController } from "../controllers/role.controller.ts";

const router = new Hono();

router.post("/:userId/roles", assignRolesToUserController);

export default router;