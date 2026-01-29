import express from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/me", protect, getProfile);

//PUT /api/users/me
router.put("/me", protect, updateProfile);

export default router;