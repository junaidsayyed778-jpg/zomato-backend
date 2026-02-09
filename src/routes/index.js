import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import restaurantRoutes from "./restaurantRoute.js";
import cartRoutes from "./cartRoutes.js"
import menuItemRoutes from "./menuItemRoutes.js"
import publicRoutes from "./publicRoutes.js"
import orderRoutes from "./orderRoutes.js"

export const loadRoutes = (app) => {
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/restaurants", restaurantRoutes);

    //orders (RBAC flows)
    app.use("/api/orders", orderRoutes);

    app.use("/api/menu-items",menuItemRoutes);
    app.use("/api/public", publicRoutes);
};