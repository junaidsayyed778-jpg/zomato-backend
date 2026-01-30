import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
        .string()
        .min(2, "Name must be ar least 3 charachters"),

        email: z
        .string()
        .email("Invalid email format"),

        password: z
        .string()
        .min(6, "Password must be at least 6 characters long "),

        role: z
        .enum(["USER", "RESTUARANT_OWNER"])
        .optional(),
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