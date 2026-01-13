// Zod validations for authentication types
import {z} from "zod";

export const loginSchema=z.object({
    email:z.string(),
    password:z.string().min(6)
});

export const signupSchema=z.object({
    name:z.string(),
    email:z.string(),
    password:z.string().min(6),
    rolename:z.string()
});
 