import Restaurant from "../models/Restaurant.js";

//POST /api/reetaurants
export const createRestaurant = async (req, res, next) => {
      console.log("REQ BODY:", req.body);
  console.log("USER:", req.user);
    try{
        const { name, location } = req.body;

        if(!name){
            return res.status(400).json({ message: "Restaurant name is required"})
        }

        const restaurant  = await Restaurant.create({
            name,
            location,
            owner: req.user.id,
        });

        res.status(201).json({
            message: "Restaurant created successfully",
            restaurant ,
        })
    
    }catch(err){
        next(err)
    }
}
//GET /api/restaurants
export const getAllRestaurant = async (req, res, next) => {
    try{
        const restaurant  = await Restaurant.find();

        res.status(200).json({
            success: true,
            data: restaurant ,
        });
    }catch(err){
        next(err);
    }
};

//PUT /api/restaurant/:id
export const updateRestaurant = async (req, res, next) => {
    try{
        const restaurant  = await Restaurant.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if(!restaurant ){
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.status(200).json({
            success: true,
            data: restaurant ,
        })

    }catch(err){
        next(err)
    }
}