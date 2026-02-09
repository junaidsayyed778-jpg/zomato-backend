import express from "express";
import { createRestaurant, getAllRestaurant, updateRestaurant } from "../controllers/restaurantController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { zodValidate } from "../middlewares/zodValidate.js";
import { createRestaurantSchema } from "../validators/restaurantSchema.js";
import { getIncomingOrders, manageOrderStatus } from "../controllers/orderController.js";


const router = express.Router();

//PUBLIC - list restaurants
router.get("/", getAllRestaurant);

//PROTECTED - create restaurant
router.post("/", protect,
    restrictTo("ADMIN", "RESTAURANT_OWNER"),
    zodValidate(createRestaurantSchema),
    createRestaurant
);

//PROTECTED - update restaurant
router.put(
    "/:id",
    protect,
    restrictTo("ADMIN", "RESTAURANT_OWNER"),
    zodValidate(createRestaurantSchema),
    updateRestaurant
);

router.get(
  "/incoming",
  protect,
  restrictTo("RESTAURANT_OWNER"),
  getIncomingOrders,
);

router.patch(
  "/orders/:orderId/manage",
  protect,
  restrictTo("RESTAURANT_OWNER"),
  manageOrderStatus,
);


export default router;