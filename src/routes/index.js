import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import restaurantRoutes from "./restaurantRoute.js";
import cartRoutes from "./cartRoutes.js"

export const loadRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/cart", cartRoutes)
    app.use("/api/restaurants", restaurantRoutes);
};