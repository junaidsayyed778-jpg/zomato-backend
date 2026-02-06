import Food from "../models/Food.js"
import Order from "../models/Order.js";

export const createOrder = async ({ userId, items, paymentMethod }) => {
    const foods = await Food.find({
        _id: {$in: items.map((i) => i.foodId)},
    });

    if(foods.length !== items.length) {
        throw new Error("Invalid food item in order");
    }

    if(foods.length === 0){
        throw new Error("   No food items found");
    }

    //Ensure all foods belongs to same restaurant
    const restaurantId = foods[0].restaurant.toString();

    const sameRestaurant = foods.every(
        (food) => food.restaurant.toString() === restaurantId
    );

    
    if(!sameRestaurant){
        throw new Error("All items must be from the same restaurant")
    }

    //calculate total amount
    const totalAmount = foods.reduce((sum, food) => {
        const item = items.find(
            (i) => i.foodId.toString() === food._id.toString()
        );

        return sum + food.price * item.quantity;
    }, 0);

    //create order
     const order = Order.create({
        user: userId,
        restaurant: restaurantId,
        items: items.map((i) => ({
            food: i.foodId,
            quantity: i.quantity,
        })),
        totalAmount,
        paymentMethod,
    });

    return order;
};
