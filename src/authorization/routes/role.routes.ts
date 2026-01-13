// routes for roles assigned to users
// given on creation of users the role is assigned as User by default
import { Hono } from "hono";
import {
  
 
  createRoleController,
} from "../controllers/role.controller.ts";
const roleRouter = new Hono();

// POST / - Create a new role
roleRouter.post("/", createRoleController);




export default roleRouter;
