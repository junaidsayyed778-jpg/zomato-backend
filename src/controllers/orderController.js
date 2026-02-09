
import { createOrder } from "../factories/OrderFactory.js";
import IdempotencyKey from "../models/IdempotencyKey.js";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";


export const placeOrder = async (req, res, next) => {
  try {
    const order = await createOrder({
      userId: req.user._id,
      restaurant: req.body.restaurant,
      items: req.body.items,
      paymentMethod: req.body.paymentMethod,
    
    });

    const response = {
      success: true,
      message: "Order places succesfully",
      order,
    };

    //store result in idempotency cache
    if (req.idempotencyKey) {
      await IdempotencyKey.findOneAndUpdate(
        { key: req.idempotencyKey },
        { $set: { status: "DONE", response } },
        { new: true }
      );
    }

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

export const acceptOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("restaurant");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    //Ownership check
    if (order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not your restaurant" });
    }

    //status guard
    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.status}`,
      });
    }

    order.status = "ACCEPTED";
    await order.save();

    res.json({
      success: true,
      message: "Order accepted",
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const rejectOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("restaurant");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    //ownership check
    if (order.restaurant.owner.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ success: false, message: "Not your restaurant" });
    }

    // status guards
    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.status}`,
      });
    }

    order.status = "REJECTED";
    await order.save();

    res.json({
      success: true,
      message: "Order rejected",
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const order = await Order.find({ user: userId })
      .populate("restaurant", "name location")
      .populate("items.menuItem", "name price image")
      .sort({ createdAt: -1 }); //latest first

    res.json({
      success: true,
      count: order.length,
      order,
    });
  } catch (err) {
    next(err);
  }
};

export const getIncomingOrders = async (req, res, next) => {
  try {
    //find restaurant owned by this owner
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    //find pending orders for this owner
    const orders = await Order.find({
      restaurant: restaurant._id,
      status: "PENDING",
    })
      .populate("user", "name email")
      .populate("items.menuItem", "name price");

    res.json({
      success: true,
      orders,
      restaurant: restaurant.name,
    });
  } catch (err) {
    next(err);
  }
};

const transitions = {
  ACCEPT: { from: ["PENDING"], to: "ACCEPTED" },
  REJECT: { from: ["PENDING"], to: "REJECTED" },
  PREPARE: { from: ["ACCEPTED"], to: "PREPARING" },
  READY: { from: ["PREPARING"], to: "READY_FOR_PICKUP" },
  DELIVER: { from: ["PREPARING"], to: "OUT_FOR_DELIVERY" },
  COMPLETE: { from: ["READY_FOR_PICKUP", "OUT_FOR_DELIVERY"], to: "COMPLETED" },
};

export const manageOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { action } = req.body; // ACCEPT | REJECT | PREPARE | READY

    if (!transitions[action]) {
      return res.status(400).json({
        success: false,
        message: "Invalid action",
      });
    }
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res
        .status(403)
        .json({ success: false, message: "Not your restaurant" });
    }

    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurant._id,
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const { from, to } = transitions[action];

    if (!from.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot ${action} order from ${order.status}`,
      });
    }

    order.status = to;
    await order.save();
    res.json({
      success: true,
      message: `Order ${order.status} successfully`,
      order,
    });
  } catch (err) {
    next(err);
  }
};

