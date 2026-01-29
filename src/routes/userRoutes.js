import express from "express";
import { 
    getProfile, 
    updateProfile 
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { zodValidate } from "../middlewares/zodValidate.js";

const router = express.Router();

router.get("/me", protect, getProfile);

//PUT /api/users/me
router.put("/me", protect, zodValidate(updateProfile),
updateProfile
);

export default router;