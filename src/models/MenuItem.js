import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 1,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },
        image: String
    },
    { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);