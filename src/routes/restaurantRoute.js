import express from "express";
import { createRestaurant, getAllRestaurant, updateRestaurant } from "../controllers/restaurantController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createOrderSchema } from "../validators/orderSchema.js";
import { createRestaurantSchema } from "../validators/restaurantSchema.js";


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