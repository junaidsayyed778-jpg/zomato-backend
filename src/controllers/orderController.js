import { createOrder } from "../factories.js";

export const createOrderController = async (req, res) => {
    const order = await createOrder(req.body);
    await order.save();

    res.status(201).json(order);
};