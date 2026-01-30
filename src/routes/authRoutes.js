import { Router } from "express";
import { zodValidate } from "../middlewares/zodValidate";

const router = Router();

router.post("/register", zodValidate(registerSchema))