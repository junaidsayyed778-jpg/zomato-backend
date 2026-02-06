import express from "express";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createOrderSchema } from "../validators/orderSchema.js";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder } from "../factories/OrderFactory.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { acceptOrder, rejectOrder } from "../controllers/orderController.js";

const router = express.Router();


// create order (USER)
router.post("/", protect, zodValidate(createOrderSchema),
createOrder);

//Restaurant owner action
router.patch("/restaurant/order/:id/accept", protect, restrictTo("RESTAURANT_OWNER"), acceptOrder);

router.patch("/restaurant/orders/:id/reject", protect, restrictTo("RESTAURANT_OWNER"), rejectOrder);

export default router;