import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { restrictTo } from "../middlewares/roleMiddleware.js";
import { addMenuItem, deleteMenuItem, getAllMenuItemForHome, getRestaurantMenu, updateMenuItem } from "../controllers/menuItemController.js";

const router = express.Router();

//home page feed
router.get("/home", getAllMenuItemForHome);

//Restaurant owner adds menu item
router.post("/", protect, restrictTo("RESTAURANT_OWNER"), addMenuItem);

//public: get menu of a retaurant
router.get("/restaurants/:restaurantsId", getRestaurantMenu);

//owner update item
router.patch("/:menuItemId", updateMenuItem);

//owner delete item
router.delete("/:menuItemId", deleteMenuItem);

export default router;