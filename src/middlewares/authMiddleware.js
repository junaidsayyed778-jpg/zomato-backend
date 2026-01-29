import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;

        //check  token presence
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        //extract token
        const token = authHeader.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //fetch user
        const user = await User.findById(decoded.id);

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User no longer exixts"
            });
        }

        //attack user to request
        req.user = user;

        next();
    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid or expires token",
        });
    }
};