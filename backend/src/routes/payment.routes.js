import express from "express";
import {
  createOrder,
  verifyPayment,
  webhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Create order
router.post("/create-order", createOrder);

// Verify payment from frontend
router.post("/verify", verifyPayment);

// Razorpay webhook (set this URL in Razorpay Dashboard)
router.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default router;
