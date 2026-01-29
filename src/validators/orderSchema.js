import {z} from "zod";



export const createOrderSchema = z.object({
    user: z.string().length(24),
    restaurant: z.string().length(24),

    items: z
    .array(
        z.object({
            MenuItem: z.string().length(24),
            quantity: z.number().int().min(1),
        })
    )
    .min(1),

    paymentMethod: z.enum(["UPI", "CARD", "NETBANKING"]),
    orderType: z.enum(["DELIVERY", "PICKUP"]),

    deliveryAddress: z.string().optional(),
    pickupTime: z.string().optional(),

    scheduledFor: z.string().optional(),
})

.superRefine((data, ctx) => {
    if(data.orderType === "DELIVERY" && !data.deliveryAddress) {
        ctx.addIssue({
            path: ["deliveryAddress"],
            message: "deliveryAdress is required for DELIVERY orders",
        });
    }

    if (data.orderType === "PICKUP" && !data.pickupTime) {
        ctx.addIssue({
            path: ["pickupTime"],
            message: "pickupTime is required for PICKUP orders",
        });
    }
});