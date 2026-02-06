import Food from "../models/MenuItem.js"

export const listFoods = async (req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalFoods = await Food.countDocuments({ isAvailable: true });
        const foods = await Food.find({ isAvailable: true })
            .populate("restaurant")
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            data: foods,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: totalFoods,
                totalPages: Math.ceil(totalFoods / limit)
            }
        });
    }catch(err){
        next(err)
    }
};