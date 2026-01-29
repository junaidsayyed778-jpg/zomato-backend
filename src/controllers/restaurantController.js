import Restaurant from "../models/Restaurant.js";

//POST /api/restaurants
export const createRestaurant = async (req, res, next) => {
    try{
        const restaurant = await Restaurant.create(req.body);

        res.status(201).json({
            success: true,
            data: restaurant,
        });
    }catch(err){
        next(err);
    }
};

//GET /api/restaurants
export const getAllRestaurant = async (req, res, next) => {
    try{
        const restaurant = await Restaurant.find();

        res.status(200).json({
            success: true,
            data: restaurant,
        });
    }catch(err){
        next(err);
    }
};

//PUT /api/restaurant/:id
export const updateRestaurant = async (req, res, next) => {
    try{
        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if(!restaurant){
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant,
        })

    }catch(err){
        next(err)
    }
}