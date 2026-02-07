import z from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    restaurant: z.string().length(24),
    items: z.array(
      z.object({
        foodId: z.string().length(24),
        quantity: z.number().int().min(1),
      })
    ).min(1),
    paymentMethod: z.enum(["UPI", "CARD", "NETBANKING"]),
    orderType: z.enum(["DELIVERY", "PICKUP"]),
  }),
});
