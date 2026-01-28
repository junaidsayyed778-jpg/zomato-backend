import MenuItem from "../models/MenuItem.js";

// function to calculate total price of items
export const calculateTotal = async (items) =>{
    let total = 0;
 
    for(const item of items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if(!menuItem || !menuItem.isAvailable) {
            throw new Error(`Menu item unavailable: ${item.menuItem}`);
        }
        total += menuItem.price * item.quantity;
    }
    return total;
}