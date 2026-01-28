import express from "express";
import cors from "cors";

const app = express();

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


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    });
});

export default app;