import { Router } from "express";
import { 
    getProfile, 
    updateProfile 
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { zodValidate } from "../middlewares/zodValidate.js";
import { updateUserSchema } from "../validators/userSchema.js";

const router = Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, zodValidate(updateUserSchema), updateProfile);

export default router;