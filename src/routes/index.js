import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import restaurantRoutes from "./restaurantRoute.js";
import cartRoutes from "./cartRoutes.js"
import foodRoutes from "./foodRoutes.js"

export const loadRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/foods", foodRoutes);
    app.use("/api/restaurants", restaurantRoutes);
};