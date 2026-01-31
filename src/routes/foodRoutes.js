import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/roleMiddleware";
import { addFood } from "../controllers/foodController";

const router = Router();

router.post("/add", protect, restrictTo("RESTAURANT_OWNER"), addFood )