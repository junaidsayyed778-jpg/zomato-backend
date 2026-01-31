import User from "../models/User.js"

export const getCart = async (req, res, next) => {
    try{
        const user = await User.findById(req. user.id).populate("cart.items.food");

        res.json({
            cart: user.cart || { items: [] }
        })
    }catch(err){
        next(err);
    }
};

export const addToCart = async(req, res, next) => {
    try{
        const { foodId, quantity } = req.body;

        const user = await User.findById(req.user.id);

        const existingItem = user.cart.items.find(
            (item) => item.food.toString() === foodId
        );

        if(existingItem){
            existingItem.quanitity += quantity || 1;
        }else{
            user.cart.items.push({
                food: foodId,
                quanitity: quantity || 1,
            });
        }

        res.json({ message: "Item added to cart", cart: user.cart });
    }catch(err){
        next(err)
    }
};

export const removeFromCart = async(req, res, next) => {
    try{
        const { foodId } = req.params;

        const user = await User.findById(req.user.id);

        user.cart.items = user.cart.items.filter(
            (item) => item.food.toString() !== foodId
        );

        await user.save();

        res.json({ message: "Item romoved", cart: user.cart });
    }catch(err){
        next(err)
    }
};

export const clearCart = async(req, res, next) => {
    try{
        const user = await User.findById(req.user.id);

        user.cart.items = [];
        await user.save();

        res.json({ message: "Cart cleared"})
    }catch(err){
        next(err)
    }
};