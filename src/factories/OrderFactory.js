import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";

export const createOrder = async ({ userId, items, paymentMethod, idempotencyKey = null }) =>{
    if(!items || items.length === 0 ){
        throw new Error("Order must contain at least one item");
    }

    //fetch menu items from DB 
    const menuItems = await MenuItem.find({
        _id: {$in: items.map((i) => i.foodId)},
        isAvailable: true,
    }).populate("restaurant");

    if(menuItems.length !== items.length) {
        throw new Error("One or more menu items are invalid or unavailable");
    }

    //all items must belong to same restaurant
   const restaurantId = menuItems[0].restaurant._id;

    for(let item of menuItems){
        if(item.restaurant._id.toString() !== restaurantId.toString()) {
            throw new Error("All items must be from the same restaurant")
        }
    }

    //calculate total amount
    let totalAmount = 0;

    const orderItems = menuItems.map((menuItem) =>{
        const reqItem = items.find(
            (i) => i.foodId.toString() === menuItem._id.toString()
        );

        const quantity = reqItem?.quantity || 1;
        totalAmount += menuItem.price * quantity;

        return{
            menuItem: menuItem._id,
            quantity,
            price: menuItem.price,
        };
    });

    // If an idempotency key is provided, atomically create-or-return the same order
    if (idempotencyKey) {
        const order = await Order.findOneAndUpdate(
            { idempotencyKey },
            {
                $setOnInsert: {
                    user: userId,
                    restaurant: restaurantId,
                    items: orderItems,
                    totalAmount,
                    paymentMethod,
                    status: "PENDING",
                    idempotencyKey,
                },
            },
            { new: true, upsert: true }
        );

        return order;
    }

    //create order without idempotency key
    const order = await Order.create({
        user: userId,
        restaurant: restaurantId,
        items: orderItems,
        totalAmount,
        paymentMethod,
        status: "PENDING",
    });

    return order;
}