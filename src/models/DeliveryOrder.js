import Order from "./Order.js";
import mongoose from "mongoose";

const deliveryOrderSchema = new mongoose.Schema(
    {
        deliveryAdress: {
            type: String,
            required: true,
        },
    }
);

export default Order.discriminator(
    "DELIVERY",
    deliveryOrderSchema
);

