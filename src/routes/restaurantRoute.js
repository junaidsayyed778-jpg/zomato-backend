import express from "express";
import { getAllRestaurant } from "../controllers/restaurantController";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/roleMiddleware";
import { zodValidate } from "../middlewares/zodValidate";

const router = express.Router();

//PUBLIC - list restaurants
router.get("/", getAllRestaurant);

//PROTECTED - create restaurant
router.post("/", protect,
    restrictTo("ADMIN", "RESTURANT_OWNER"),
    zodValidate(crete)
)