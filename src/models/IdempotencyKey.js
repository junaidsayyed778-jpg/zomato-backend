import mongoose from "mongoose";
import { required } from "zod/mini";

const idempotencyKeySchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },
        
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        requestHash:{
            type: String,
            required: true
        },
        status:{
            type: String,
            enum: ["IN_PROGRESS", "DONE"],
            default: "IN_PROGRESS"
        },
        response: {
                type: Object,
                required: false,
                default: null,
            },  //store order response
    },
    {timestamps: true}
    
);
idempotencyKeySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 } );

export default mongoose.model("Idempotency", idempotencyKeySchema);