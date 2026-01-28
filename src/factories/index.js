import { NormalOrderFactory } from "./NormalOrderFactory.js";
import { ScheduledOrderFactory } from "./ScheduledOrderFactory.js"

export const createOrder = async (data) => {
    if(data.scheduledFor){
        return ScheduledOrderFactory.createOrder(data);
    }

    return NormalOrderFactory.createOrder(data);
}