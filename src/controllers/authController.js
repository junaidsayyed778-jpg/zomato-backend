import bcrypt from "bcrypt"
import User from "../models/User.js";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import Restaurant from "../models/Restaurant.js";

export const register = async (req, res, next) => {
    try{

        const hashedPassword = await bcrypt.hash(req.body.password, 10);


        const user = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        //set httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            accessToken: accessToken,
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

                let restaurant = null;

                if(user.role === "RESTAURANT_OWNER"){
                    restaurant = await Restaurant.findOne({ owner: user.id }).select("name location")
                }

                user.refreshToken = refreshToken;
                await user.save();

                //set httpOnly cookie
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000,  //days
                })

                res.status(200).json({
                    message: "Login successful",
                    accessToken: accessToken,
                    user: {
                        _id: user.id,
                        name: user.name,
                        role: user.role
                    },
                    restaurant
                });

 }catch(err){
        next(err);
    }
};

export const refreshAccessToken = async (req, res, next) => {
    try{
        const refreshToken = req.cookies && req.cookies.refreshToken;

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
