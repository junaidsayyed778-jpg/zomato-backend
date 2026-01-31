

export class ScheduledOrderFactory {
    static async createOrder(data) {
        const order = await NormalOrderFactory.createOrder(data);

        order.scheduledFor = data.scheduledFor;

        return order;
    }
}