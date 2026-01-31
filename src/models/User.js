import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        food:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
        },
        quanitity:{
            type: Number,
            default: 1,
            min: 1,
        },
    },

    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        role: {
                type: String,
                enum: ["USER", "ADMIN", "RESTAURANT_OWNER"],
                default: "USER",
            
        },
        refreshToken: {
            type: String,
            select: false,
        },

        //composition cart is part of user

        cart: {
            items: [cartItemSchema],
    },
},
    { timestamps: true }
);
export default mongoose.model("User", userSchema);