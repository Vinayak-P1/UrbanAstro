import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { createCoupon, listCoupons, validateCoupon, toggleCoupon } from "../controllers/coupon.controller.js";

const router = Router();

// Admin
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, listCoupons);

// Admin toggle (active/inactive)
router.put("/:id/toggle", protect, adminOnly, toggleCoupon);

// Public validate
router.get("/validate", validateCoupon); // /api/coupons/validate?code=FIRST50

export default router;
