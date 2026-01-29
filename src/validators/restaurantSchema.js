import {z} from "zod";

export const createRestaurantSchema = z.object({
    name: z.string().min(2),
    location: z.string().min(2)
});

export const updateRestaurantSchema = z.object({
    name: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    isOpen: z.boolean().optional(),
});