import express from "express";
import { getPricing, updatePricing } from "../controllers/pricing.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get pricing (public)
router.get("/", getPricing);

// Update pricing (admin only)
router.post("/update", protect, updatePricing);

export default router;
