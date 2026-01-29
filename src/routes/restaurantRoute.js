import express from "express";

const router = express.Router();

//PUBLIC - list restaurants
router.get("/", get)
