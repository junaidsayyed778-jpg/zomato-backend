import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "../src/models/Order.js";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB");

  // Find duplicate groups by exact match on user, restaurant, totalAmount, paymentMethod and items
  const dupGroups = await Order.aggregate([
    {
      $group: {
        _id: {
          user: "$user",
          restaurant: "$restaurant",
          totalAmount: "$totalAmount",
          paymentMethod: "$paymentMethod",
          items: "$items",
        },
        ids: { $push: "$_id" },
        count: { $sum: 1 },
      },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  console.log(`Found ${dupGroups.length} duplicate groups`);

  for (const g of dupGroups) {
    const orders = await Order.find({ _id: { $in: g.ids } }).sort({ createdAt: 1 });
    const keep = orders[0];
    const remove = orders.slice(1);
    if (remove.length) {
      const removeIds = remove.map((o) => o._id);
      await Order.deleteMany({ _id: { $in: removeIds } });
      console.log(`Removed ${removeIds.length} duplicates for group ${JSON.stringify(g._id)}`);
    }
  }

  // Remove any existing idempotencyKey fields that are explicitly null
  // (documents that have idempotencyKey: null will violate unique index semantics)
  const res = await Order.updateMany({ idempotencyKey: null }, { $unset: { idempotencyKey: "" } });
  if (res.modifiedCount) {
    console.log(`Unset idempotencyKey on ${res.modifiedCount} documents where it was null`);
  }

  // Ensure unique sparse index on idempotencyKey
  try {
    await Order.collection.createIndex({ idempotencyKey: 1 }, { unique: true, sparse: true });
    console.log("Created unique sparse index on idempotencyKey");
  } catch (err) {
    console.error("Index creation failed:", err.message);
  }

  console.log("Done");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
