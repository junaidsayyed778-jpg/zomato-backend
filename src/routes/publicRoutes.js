import { Router } from "express";
import { listFoods } from "../controllers/publicController";

const router = Router();

router.get("/foods", listFoods);

export default router;