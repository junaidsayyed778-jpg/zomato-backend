import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cartController.js";

const router = Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.delete("/romove'/:foodId", protect, removeFromCart);
router.delete("/clear", protect, clearCart);

export default router;