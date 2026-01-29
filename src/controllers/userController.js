import User from "../models/User.js";

// GET /api/users/me
export const getProfile = async (req, res, next) => {
    try{
        res.status(200).json({
            success: true,
            date: req.user,
        });
    }catch(err){
    next(err);
    }
};

//PUT /api/users/me

export const updateProfile = async (req, res, next) => {
    try{
        const user = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: user,
        })
    }catch(err){
        next(err);
    }
}