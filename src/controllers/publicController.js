import Food from "../models/Food.js"

export const listFoods = async (req, res, next) => {
    try{
        const foods = await Food.find({ isAvailable: true}).populate("restaurant");

        res.json(foods);
    }catch(err){
        next(err)
    }
};