import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { addFood } from "../controllers/foodController.js";

const router = Router();

router.post("/:restaurantId/add", protect, restrictTo("RESTAURANT_OWNER"), addFood );

export default router;