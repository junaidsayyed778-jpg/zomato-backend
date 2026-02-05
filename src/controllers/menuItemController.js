import { object, success } from "zod";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// add menu item (owner only)
export const addMenuItem = async (req, res, next) => {
    try{
        const { name, price, image, restaurantId} = req.body;

        if(!restaurantId) {
            return res.status(400).json({ message: "    Restaurant is required"});
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if(!restaurant) {
            return res.status(404).json({ message: "Restaurant not found"})
        }

        //ownership check
        if(restaurant.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Not your restaurant"})
        }

        const menuItem = await MenuItem.create({
            name,
            price,
            image,
            restaurant: restaurant._id,
        });

        res.status(201).json({
            success: true,
            message: "Menu item added",
            menuItem,
        });
    }catch(err){
        next(err);
    }
};

//get menu of a restaurant (public)
export const getRestaurantMenu = async (req, res, next) => {

    try{
        const { restaurantId } = req.params;

        const menu = await MenuItem.find({ restaurant: restaurantId });

        res.json({
            success: true,
            count: menu.length,
            menu,
        });
    }catch(err){
        next(err);
    }
};

//update menu item (owner only)
export const updateMenuItem = async(req, res, next) => {
    try{
        const { menuItemId } = req.params;

        const menuItem = await MenuItem.findById(menuItemId).populate("restaurant");

        if(!menuItem){
            return res.status(404).json({ message: "Menu item is not found"});
        }

        if(menuItem.restaurant.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Not your restaurant"});
        }

        Object.assign(menuItem, req.body);
        await menuItem.save();

        res.json( { success: true, menuItem });
    }catch(err){
        next(err);
    }
};

//delete memu item (owner only)
export const deleteMenuItem = async (req, res, next) =>{
    try{
        const { menuItemId } = req.params;

        const menuItem = await MenuItem.findById(menuItemId).populate("retaurant");

        if(!menuItem) {
            return res.status(404).json({ message: "Not your restaurant item"})
        }

        await menuItem.deleteOne();

        res.json({success: true, message: "Menu item deleted"})
    }catch(err){
        next(err)
    }
}

export const getAllMenuItemForHome = async (req, res, next) =>{
    try{
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const items = await MenuItem.find({ isAvailable: true })
      .populate("restaurant", "name location image")
      .sort({ createdAt: -1 }) //newest first
      .skip(skip)
      .limit(limit);

      const total = await MenuItem.countDocuments({ isAvailable: true });

      res.json({
        success: true,
        page,
        total,
        count: items.length,
        items,
      });
    }catch(err){
        next(err);
    }
};