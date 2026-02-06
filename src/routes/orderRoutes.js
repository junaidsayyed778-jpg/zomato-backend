import express from "express";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createOrderSchema } from "../validators/orderSchema.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder } from "../factories/OrderFactory.js";

const router = express.Router();


// create order (USER)
router.post("/", protect, zodValidate(createOrderSchema),
createOrder);



export default router;