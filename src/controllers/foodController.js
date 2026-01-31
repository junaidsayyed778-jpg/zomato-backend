import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";

export const addFood = async (req, res, next) => {
    try{
        const { name, price, description, restaurantId } = req.body;

            console.log("👉 Logged-in User ID:", req.user.id);
            console.log("👉 Restaurant ID from body:", restaurantId);

        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            owner: req.user.id,
        });

        if(!restaurant){
            return res.status(403).json({ message: "Not your restaurant" });
        }

        const food = await Food.create({
            name,
            price,
            description,
            restaurant: restaurant._id,
        });

        res.status(201).json({
            message: "Food added successfully",
            food,
        })
    }catch(err){
        next(err);
    }
};