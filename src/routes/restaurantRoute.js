import express from "express";
import { createRestaurant, getAllRestaurant, updateRestaurant } from "../controllers/restaurantController";
import { protect } from "../middlewares/authMiddleware";
import { restrictTo } from "../middlewares/roleMiddleware";
import { zodValidate } from "../middlewares/zodValidate";
import { createOrderSchema } from "../validators/orderSchema";


const router = express.Router();

//PUBLIC - list restaurants
router.get("/", getAllRestaurant);

//PROTECTED - create restaurant
router.post("/", protect,
    restrictTo("ADMIN", "RESTURANT_OWNER"),
    zodValidate(createOrderSchema),
    createRestaurant
);

//PROTECTED - update restaurant
router.put(
    "/:id",
    protect,
    restrictTo("ADMIN", "RESTURANT_OWNER"),
    zodValidate(createRestaurantSchema),
    updateRestaurant
);

export default router;