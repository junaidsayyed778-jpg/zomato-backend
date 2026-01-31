import Food from "../models/Food.js"
import order from "../models/Order.js";

export const createOrder = async ({ userId, items, paymentMethod }) => {
    const foods = await Food.find({
        _id: {$in: items.map((i) => i.foodId)},
    });

    if(foods.length !== items.length) {
        console.log("Invalid food item in order");
    }

    const restaurantId = foods[0].restuarant;

    const totalAmount = foods.reduce((sum, food) => {
        const qty = items.find((i) => i.foodId === food.id)?.quantity || 1;
    }, 0);

    return order.create({
        user: userId,
        restaurant: restaurantId,
        items: items.map((i) => ({
            food: i.foodId,
            quantity: i.quantity,
        })),
        totalAmount,
        paymentMethod,
    });
};
