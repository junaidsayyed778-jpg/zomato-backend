import DeliveryOrder from "../models/DeliveryOrder.js";
import PickupOrder from "../models/PickupOrder.js";
import { calculateTotal } from "../utils/calculateTotal.js";

export class NormalOrderFactory {
    static async createOrder(data) {
        const {
            orderType,
            user,
            restaurant,
            items,
            paymentMethod,
            deliveryAddress,
            pickupTime,
        } = data;

        const totalAmount = await calculateTotal(items);

        if(orderType === "DELIVERY") {
            return new DeliveryOrder({
                user,
                restaurant,
                items,
                totolPrice: totalAmount,
                paymentMethod,
                deliveryAddress,
            });
        }

        if(orderType === "PICKUP") {
            return new PickupOrder({
                user,
                restaurant,
                items,
                items,
                totalPrice: totalAmount,
                paymentMethod,
                pickupTime,
            })
        }

        throw new Error(`Invalid order type: ${orderType}`);
    }
}