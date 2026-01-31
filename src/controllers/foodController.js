import Food from "../models/Food";
import Restaurant from "../models/Restaurant";

export const addFood = async (req, res, next) => {
    try{
        const { name, price, description, restaurantId } = req.body;

        const restaurant = await Restaurant.findOne({
            _id: restaurantId,
            owner: req.user.id,
        });

        if(!restaurant){
            return res.status(403).json({ message: "Not your resturant" });
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