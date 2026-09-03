import { z } from "zod";

const authBaseSchema = z.object({
  email: z.email("Invalid email address").trim().lowercase(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = authBaseSchema;
export const registerSchema = authBaseSchema.extend({
  name: z.string().trim().min(2, "Name must have at least 2 characters"),
});
