import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 3 charachters long "),

        email: z.string().email("Invalid email format"),

        password: z.string().min(6, "Password must be at least 6 characters long "),

        role: z.enum(["USER", "RESTAURANT_OWNER"]).optional(),

        address: z.string().min(5)
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
        .string()
        .email("Invalid email"),

        password: z
        .string()
        .min(6, "Password is required"),
    }),
});