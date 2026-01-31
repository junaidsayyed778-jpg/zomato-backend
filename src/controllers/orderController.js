import { createOrder } from "../factories/OrderFactory.js"

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