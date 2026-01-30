import mongoose from "mongoose";

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
        address: {
            type: String,
            required: true,
        },
        role: {
                type: String,
                enum: ["USER", "ADMIN", "RESTURANT_OWNER"],
                default: "USER",
            
        },
        refreshToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);
export default mongoose.model("User", userSchema);