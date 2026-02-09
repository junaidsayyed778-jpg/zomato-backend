import mongoose from "mongoose";
import { required } from "zod/mini";


const baseOrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },

        items: [
            {
                menuItem: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: true,
                    min: 1,                
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            price: {
                type: Number, required: true
            },
            
        },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 1,
        },
        
        paymentMethod: {
            type: String,
            enum: ["CASH", "CARD", "UPI"],
            default: "CASH",
            required: true,
        },

        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "PREPARING","PICKUP", "DELIVERED", "REJECTED","READY_FOR_PICKUP", "OUT_OF_DELIVERY", "COMPLETED"],
            default: "PENDING",
        },
        scheduledFor:{
            type: Date,
            default: null,
        },
        idempotencyKey: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
        discriminatorKey: "orderType",
    }
);

const order = mongoose.model("Order", baseOrderSchema);
export default order;