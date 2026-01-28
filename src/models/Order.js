import mongoose from "mongoose";


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
        },
        ],

        totalPrice: {
            type: Number,
            required: true,
            min: 1,
        },
        
        paymentMethod: {
            type: String,
            enum: ["CASH", "CARD", "ONLINE"],
            default: "CASH",
            required: true,
        },

        status: {
            type: String,
            enum: ["CREATED", "PAID", "PREPARING", "DELIVERED", "CANCELLED"],
            default: "CREATED",
        },
    },
    {
        timestamps: true,
        discriminatorKey: "orderType",
    }
);

const order = mongoose.model("Order", baseOrderSchema);
export default order;