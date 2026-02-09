import IdempotencyKey from "../models/IdempotencyKey.js";
import crypto from "crypto";

// simple stable hash of request body
const hashBody = (body) => {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(body || {}))
    .digest("hex");
};

export const Idempotency = async (req, res, next) => {
  try {
    const key = req.headers["idempotency-key"];

    if (!key) {
      return res.status(400).json({
        success: false,
        message: "Idempotency-Key header required",
      });
    }

    const requestHash = hashBody(req.body);

    // 1️⃣ Try to find existing key
    const existing = await IdempotencyKey.findOne({ key });

    // ✅ Case 1: Completed request → return cached response
    if (existing && existing.status === "DONE") {
      if (existing.requestHash !== requestHash) {
        return res.status(409).json({
          success: false,
          message: "Idempotency key already used with different request payload",
        });
      }

      return res.status(200).json(existing.response);
    }

    // ⏳ Case 2: In progress → reject fast retry
    if (existing && existing.status === "IN_PROGRESS") {
      if (existing.requestHash !== requestHash) {
        return res.status(409).json({
          success: false,
          message: "Idempotency key already in use with different request payload",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Request is already being processed. Retry later.",
      });
    }

    // 3️⃣ Case 3: Not found → atomically reserve key
    try {
      await IdempotencyKey.create({
        key,
        user: req.user?._id || null,   // avoid crash if auth middleware order is wrong
        requestHash,
        status: "IN_PROGRESS",
      });
    } catch (err) {
      // 🧠 If two requests race, one will hit duplicate key
      if (err.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate idempotency request in progress",
        });
      }
      throw err;
    }

    // Attach to request for controller to finalize
    req.idempotencyKey = key;
    req.idempotencyRequestHash = requestHash;

    // 🪝 Monkey patch res.json to mark DONE + store response
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      await IdempotencyKey.updateOne(
        { key },
        {
          $set: {
            status: "DONE",
            response: body,
          },
        }
      );

      return originalJson(body);
    };

    next();
  } catch (err) {
    next(err);
  }
};
