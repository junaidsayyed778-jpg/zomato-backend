import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
        console.log("AUTH HEADER:", authHeader);


    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ").filter(Boolean)[1];
        console.log("TOKEN RECEIVED:", token);


    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log("DECODED:", decoded);


    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;

    console.log("REQ.USER 👉", req.user); // debug

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

