import { success } from "zod";
import { createOrder } from "../factories/OrderFactory.js"
import Order from "../models/Order.js";

export const placeOrder = async(req, res, next) => {
    try{
        const order = await  createOrder({
            userId: req.user.id,
            items: req.body.items,
            paymentMethod: req.body.paymentMethod,
        });

        res.status(201).json({ 
            message: "order placed successfully",
            order,
        })
    }catch(err){
        next(err);
    }
};

export const acceptOrder = async (req, res, next) =>{
    try{
        const order = await Order.findById(req.params.id).populate("restaurant");

        if(!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        //Ownership check
        if(order.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not your restaurant"})
        }

        //status guard
        if(order.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `Order already ${order.status}`,
            });
        }

        order.status = "ACCEPTED";
        await order.save();

        res.json({
            success: true,
            message: "Order accepted",
            order,
        })
    }catch(err){
        next(err)
    }
};

export const rejectOrder = async (req, res, next) =>{
    try{
        const order = await Order.findById(req.params.id).populate("restaurant");

        if(!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        //ownership check
        if(order.restaurant.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ success: false, message: "Not your restaurant"});
        }

        // status guards
        if(order.status !== "PENDING") {
            return res.status(400).json({
              success: false,
              message: `Order already ${order.status}`,
            });
        }

        order.status = "REJECTED";
        await order.save();

        res.json({
            success: true,
            message: "Order rejected",
            order,
        })
    }catch(err) {
        next(err)
    }
};