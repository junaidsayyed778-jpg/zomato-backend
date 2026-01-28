import Order from "./Order.js";
import mongoose from "mongoose";

const pickupOrderSchema = new mongoose.Schema(
    {
        pickupTime: {
                type: Date,
                required: true,
            },
    }
);

export default Order.discriminator(
    "PICKUP",
    pickupOrderSchema
);