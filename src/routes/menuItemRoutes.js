import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/roleMiddleware";

const router = express.Router();

//Restaurant owner adds menu item
router.post("/", protect, restrictTo,("RESTAURANT_OWNER"), add)