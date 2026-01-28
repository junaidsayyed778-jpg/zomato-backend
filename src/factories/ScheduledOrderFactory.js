import DeliveryOrder from "../models/DeliveryOrder.js";
import PickupOrder from "../models/PickupOrder.js";
import { calculateTotal } from "../utils/calculateTotal.js";

export class ScheduledOrderFactory {
    static async createOrder(data) {
        const order = await NormalOrderFactory.createOrder(data);

        order.scheduledFor = data.scheduledFor;

        return order;
    }
}