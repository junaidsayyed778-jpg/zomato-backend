import express from "express";
import cors from "cors";
import { loadRoutes } from "./routes/index.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Food Delivery Backend is running"
    });
});

// Routes
loadRoutes(app);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    });
});

export default app;