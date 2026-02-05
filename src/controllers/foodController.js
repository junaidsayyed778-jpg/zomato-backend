import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";

export const addFood = async (req, res, next) => {
    try{
        const { name, price, description } = req.body;
        const { restaurantId } = req.params;

            console.log("REQ.USER.ID 👉", req.user._id.toString());
console.log("RESTAURANT ID SENT 👉", restaurantId);

        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            owner: req.user._id,
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

         console.log("ADD FOOD HIT ✅", req.user?.role);
        res.status(201).json({
            message: "Food added successfully",
            food,
        })
    }catch(err){
        next(err);
    }
};