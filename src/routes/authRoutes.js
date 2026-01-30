import { Router } from "express";
import { zodValidate } from "../middlewares/zodValidate.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js";
import { login, refreshAccessToken, register } from "../controllers/authController.js";

const router = Router();

router.post("/register", zodValidate(registerSchema), register);
router.post("/login", zodValidate(loginSchema), login);
router.post("/refresh-token", refreshAccessToken);

export default router;