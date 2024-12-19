import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  firstname: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+$/),
  lastname: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+$/),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});

export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema.omit({ id: true });
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = userSchema.omit({ id: true }).partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;

export const loginUserSchema = userSchema.pick({ email: true, password: true });
export type LoginUser = z.infer<typeof loginUserSchema>;

export const getUserParamsSchema = z.object({
  firstNameQuery: z.string().max(50).optional(),
  lastNameQuery: z.string().max(50).optional(),
  emailQuery: z.string().max(255).optional(),
  sortBy: z.enum(["id", "firstname", "lastname", "email"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
