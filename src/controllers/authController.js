import bcrypt from "bcrypt"
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req, res, next) => {
    try{
        const user = await User.create(req.body);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            accessToken,
            refreshToken,
        });


    }catch(err){
        next(err);
    }
};

export const login = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email}).select("+password");

        if(!user){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

            const isMatch = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if(!isMatch) {
                return res.status(401).json({ message: "Invalid credentials"});
                }
            
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                user.refreshToken = refreshToken;
                await user.save();

                res.status(200).json({
                    accessToken,
                    refreshToken,
                });

 }catch(err){
        next(err);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try{
        const { refreshToken } = req.body;

        if(!refreshToken) {
            return res.status(400).json({ message: "Refresh token required " });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id).select("+refreshToken");

        if(!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({ accessToken: newAccessToken });

    }catch(err){
        next(err);
    }
};
