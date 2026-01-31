import express from "express";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createOrderSchema } from "../validators/orderSchema.js";

const router = express.Router();

router.post("/", zodValidate(createOrderSchema),
createOrderSchema);



export default router;